import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { signUpSchema, signInSchema, resetPasswordSchema } from "@/lib/validation";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, resetPassword, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) return;

      // user_roles can contain multiple rows per user; using .single() can error and cause wrong redirects
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user role:", error);
        navigate("/dashboard");
        return;
      }

      const isAdminUser =
        (roles ?? []).some(
          (r) => r.role === "super_admin" || r.role === "admin"
        );

      navigate(isAdminUser ? "/admin" : "/dashboard");
    };

    checkUserRole();
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const emailOrUsername = formData.get("emailOrUsername") as string;
    const password = formData.get("password") as string;

    // Basic validation for empty fields
    if (!emailOrUsername || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Try primary login
    const { error } = await signIn(emailOrUsername.trim(), password);
    
    if (!error) {
      setIsLoading(false);
      return;
    }

    // Fallback: If primary fails and it's the admin username, try admin email
    if (emailOrUsername.toLowerCase() === 'prime') {
      const { error: fallbackError } = await signIn('epixshots001@gmail.com', password);
      if (!fallbackError) {
        setIsLoading(false);
        return;
      }
    }
    
    // Fallback: If email login fails, try looking up as username
    if (emailOrUsername.includes('@')) {
      const usernameGuess = emailOrUsername.split('@')[0];
      const { error: fallbackError } = await signIn(usernameGuess, password);
      if (!fallbackError) {
        setIsLoading(false);
        return;
      }
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signInWithGoogle();
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;

    const validation = signUpSchema.safeParse({
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone,
    });
    
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError.message);
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(email, password, {
      first_name: firstName,
      last_name: lastName,
      phone: phone,
    });
    
    setIsLoading(false);
    
    if (error) {
      return;
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("resetEmail") as string;

    const validation = resetPasswordSchema.safeParse({ email });
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError.message);
      setIsLoading(false);
      return;
    }

    await resetPassword(email);
    
    setIsLoading(false);
    setShowResetPassword(false);
  };

  if (showResetPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md bg-card rounded-3xl shadow-lg p-8 animate-scale-in">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
            <p className="text-muted-foreground mt-2">
              Enter your email to receive a password reset link
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Input
                id="resetEmail"
                name="resetEmail"
                type="email"
                placeholder="Email"
                className="w-full rounded-xl border-input"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-3"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setShowResetPassword(false)}
              className="w-full text-muted-foreground"
            >
              Back to Login
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-[900px] h-[520px] flex rounded-3xl overflow-hidden shadow-2xl bg-card animate-scale-in">
        {/* Left Side - Welcome / Toggle */}
        <div 
          className={`w-1/2 bg-primary text-primary-foreground flex flex-col justify-center items-center px-10 transition-all duration-500 ease-in-out ${
            isRegisterMode ? 'order-2' : 'order-1'
          }`}
        >
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">
            {isRegisterMode ? "Welcome Back!" : "Hello, Welcome!"}
          </h1>
          <p className="text-lg mb-6 text-center animate-fade-in">
            {isRegisterMode ? "Already have an account?" : "Don't have an account?"}
          </p>
          <Button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-xl px-6 py-3 hover-scale"
          >
            {isRegisterMode ? "Login" : "Register"}
          </Button>
        </div>

        {/* Right Side - Forms */}
        <div 
          className={`w-1/2 bg-card flex flex-col justify-center px-10 py-8 transition-all duration-500 ease-in-out ${
            isRegisterMode ? 'order-1' : 'order-2'
          }`}
        >
          {!isRegisterMode ? (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground mb-6">Login</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    name="emailOrUsername"
                    type="text"
                    placeholder="Email or Username"
                    className="w-full rounded-xl border-input"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Admins can use username (e.g., prime)
                  </p>
                </div>
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-xl border-input"
                  required
                  minLength={4}
                />
                <button
                  type="button"
                  onClick={() => setShowResetPassword(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </button>
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Login"}
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  or login with social platforms
                </p>
                <div className="flex justify-center gap-3 mt-4">
                  <button 
                    type="button" 
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-foreground font-semibold hover-scale transition-transform"
                    aria-label="Sign in with Google"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </button>
                  <button type="button" className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center hover-scale transition-transform" aria-label="Sign in with Facebook">
                    <Facebook className="w-5 h-5 text-foreground" />
                  </button>
                  <button type="button" className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center hover-scale transition-transform" aria-label="Sign in with Instagram">
                    <Instagram className="w-5 h-5 text-foreground" />
                  </button>
                  <button type="button" className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center hover-scale transition-transform" aria-label="Sign in with LinkedIn">
                    <Linkedin className="w-5 h-5 text-foreground" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground mb-6">Register</h2>
              <form onSubmit={handleSignup} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    name="firstName"
                    placeholder="First Name"
                    className="rounded-xl border-input"
                    required
                  />
                  <Input
                    name="lastName"
                    placeholder="Last Name"
                    className="rounded-xl border-input"
                    required
                  />
                </div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-xl border-input"
                  required
                />
                <Input
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full rounded-xl border-input"
                  required
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-xl border-input"
                  required
                  minLength={6}
                />
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full rounded-xl border-input"
                  required
                  minLength={6}
                />
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Register"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
