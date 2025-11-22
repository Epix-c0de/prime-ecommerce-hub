import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { signUpSchema, signInSchema, resetPasswordSchema } from "@/lib/validation";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validation = signInSchema.safeParse({ email, password });
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError.message);
      setIsLoading(false);
      return;
    }

    const { error } = await signIn(email, password);
    
    setIsLoading(false);
    
    if (!error) {
      navigate("/dashboard");
    }
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
    
    if (!error) {
      navigate("/dashboard");
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
        <div className="w-full max-w-md bg-card rounded-3xl shadow-lg p-8">
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
      <div className="w-full max-w-[900px] h-[520px] flex rounded-3xl overflow-hidden shadow-2xl bg-card">
        {/* Left Side - Welcome / Toggle */}
        <div className={`w-1/2 bg-primary text-primary-foreground flex flex-col justify-center items-center px-10 transition-all duration-300 ${isRegisterMode ? 'order-2' : 'order-1'}`}>
          <h1 className="text-4xl font-bold mb-4">
            {isRegisterMode ? "Welcome Back!" : "Hello, Welcome!"}
          </h1>
          <p className="text-lg mb-6 text-center">
            {isRegisterMode ? "Already have an account?" : "Don't have an account?"}
          </p>
          <Button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-xl px-6 py-3"
          >
            {isRegisterMode ? "Login" : "Register"}
          </Button>
        </div>

        {/* Right Side - Forms */}
        <div className={`w-1/2 bg-card flex flex-col justify-center px-10 py-8 transition-all duration-300 ${isRegisterMode ? 'order-1' : 'order-2'}`}>
          {!isRegisterMode ? (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-6">Login</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-xl border-input"
                  required
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-xl border-input"
                  required
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
                  <button type="button" className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-foreground font-semibold">
                    G
                  </button>
                  <button type="button" className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-foreground font-semibold">
                    F
                  </button>
                  <button type="button" className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-foreground font-semibold">
                    I
                  </button>
                  <button type="button" className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-foreground font-semibold">
                    L
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
