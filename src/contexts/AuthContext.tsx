import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isGuestMode: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  enableGuestMode: () => void;
  disableGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    // Check if user was previously in guest mode
    const savedGuestMode = localStorage.getItem('betta-guest-mode');
    if (savedGuestMode === 'true') {
      setIsGuestMode(true);
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      // If user signs in, disable guest mode
      if (session?.user) {
        setIsGuestMode(false);
        localStorage.removeItem('betta-guest-mode');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      // First, try to sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('Auth signup error:', error);
        return { error };
      }
      
      // If signup was successful, wait a moment for the trigger to potentially work
      if (data.user) {
        // Wait 1 second for any triggers to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if profile was created by trigger
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();
        
        // If no profile exists, create one manually
        if (!existingProfile) {
          console.log('Creating profile manually...');
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email || email,
            });
          
          if (profileError) {
            console.error('Error creating profile manually:', profileError);
            // Still return success for auth, profile can be created later
          } else {
            console.log('Profile created successfully');
          }
        } else {
          console.log('Profile already exists (created by trigger)');
        }
      }
      
      return { error: null };
    } catch (err) {
      console.error('Unexpected error during signup:', err);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const enableGuestMode = () => {
    setIsGuestMode(true);
    localStorage.setItem('betta-guest-mode', 'true');
  };

  const disableGuestMode = () => {
    setIsGuestMode(false);
    localStorage.removeItem('betta-guest-mode');
  };

  const value = {
    user,
    session,
    loading,
    isGuestMode,
    signUp,
    signIn,
    signOut,
    resetPassword,
    enableGuestMode,
    disableGuestMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
