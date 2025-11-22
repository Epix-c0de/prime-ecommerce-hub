import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any }>;
  signIn: (emailOrUsername: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata
        }
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created successfully!");
      }
      
      return { error };
    } catch (error: any) {
      toast.error("An error occurred during sign up");
      return { error };
    }
  };

  const signIn = async (emailOrUsername: string, password: string) => {
    try {
      // Check if input is email format
      const isEmail = emailOrUsername.includes('@');
      
      if (isEmail) {
        // Direct email login
        const { error } = await supabase.auth.signInWithPassword({
          email: emailOrUsername,
          password,
        });
        
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Welcome back!");
        }
        
        return { error };
      } else {
        // Username login - lookup email first
        const { data: userData, error: lookupError } = await supabase
          .rpc('get_user_by_username_or_email', { identifier: emailOrUsername });
        
        if (lookupError || !userData || userData.length === 0) {
          toast.error("Invalid username or password");
          return { error: new Error("User not found") };
        }
        
        const userEmail = userData[0].email;
        const { error } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password,
        });
        
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Welcome back!");
        }
        
        return { error };
      }
    } catch (error: any) {
      toast.error("An error occurred during sign in");
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) {
        toast.error(error.message);
      }
      
      return { error };
    } catch (error: any) {
      toast.error("An error occurred during Google sign in");
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Signed out successfully");
      }
    } catch (error: any) {
      toast.error("An error occurred during sign out");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset email sent!");
      }
      
      return { error };
    } catch (error: any) {
      toast.error("An error occurred");
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
