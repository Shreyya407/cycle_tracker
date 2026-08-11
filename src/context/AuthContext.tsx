import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, CycleRegularity } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string, regularity: CycleRegularity) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
}

const defaultProfile: UserProfile = {
  id: 'demo-user-123',
  email: 'sarah.doe@example.com',
  full_name: 'Sarah Doe',
  avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASSGSAVOeN5OnaxdNq9Ghc8A1eVagyeo_4dF4M3WaqUIop34KkDyc1vm36n6TW9JedrL_-k2SKngEXOl9_ovvxwZgZWYSMTjIHe1u5WsG9UizGfdN17p2NvUpzdzV-UBm0Dd2K_CrrK746V3_jn42EwP0sJebaht4IRgWmoEmcpPDpzwh4gXcUg5YTe1E9KQI6h-XJTkQ0yoC2DTOHDWuC_QNpz-TWwUgYwG2Cs8UI9pNVKFAWavk',
  default_cycle_length: 28,
  default_period_length: 5,
  cycle_regularity: 'regular'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(() => {
    // Default to active demo user if Supabase is not yet configured, otherwise null until session restored
    if (!isSupabaseConfigured()) {
      const savedUser = localStorage.getItem('cyclecare_user');
      return savedUser ? JSON.parse(savedUser) : { id: defaultProfile.id, email: defaultProfile.email };
    }
    return null;
  });

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (!isSupabaseConfigured()) {
      const savedProfile = localStorage.getItem('cyclecare_profile');
      return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured() ? true : false);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      // Check current Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || '' });
          fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || '' });
          fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setProfile(data as UserProfile);
      } else {
        // Fallback default profile if new user
        const newProf: UserProfile = {
          id: userId,
          email: user?.email || '',
          full_name: 'CycleCare Member',
          default_cycle_length: 28,
          default_period_length: 5,
          cycle_regularity: 'regular'
        };
        setProfile(newProf);
      }
    } catch (e) {
      console.error('Error fetching user profile:', e);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      const demoUser = { id: defaultProfile.id, email };
      setUser(demoUser);
      setProfile({ ...defaultProfile, email });
      localStorage.setItem('cyclecare_user', JSON.stringify(demoUser));
      localStorage.setItem('cyclecare_profile', JSON.stringify({ ...defaultProfile, email }));
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? new Error(error.message) : null };
  };

  const signUp = async (email: string, password: string, name: string, regularity: CycleRegularity) => {
    if (!isSupabaseConfigured()) {
      const newProf: UserProfile = {
        id: `user-${Date.now()}`,
        email,
        full_name: name,
        default_cycle_length: 28,
        default_period_length: 5,
        cycle_regularity: regularity
      };
      const newUser = { id: newProf.id, email };
      setUser(newUser);
      setProfile(newProf);
      localStorage.setItem('cyclecare_user', JSON.stringify(newUser));
      localStorage.setItem('cyclecare_profile', JSON.stringify(newProf));
      return { error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, cycle_regularity: regularity }
      }
    });

    if (data.user && !error) {
      // Insert profile into database
      await supabase.from('profiles').insert([
        {
          id: data.user.id,
          full_name: name,
          cycle_regularity: regularity,
          default_cycle_length: 28,
          default_period_length: 5
        }
      ]);
    }

    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('cyclecare_user');
    localStorage.removeItem('cyclecare_profile');
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!profile || !user) return;
    const newProf = { ...profile, ...updated };
    setProfile(newProf);

    if (!isSupabaseConfigured()) {
      localStorage.setItem('cyclecare_profile', JSON.stringify(newProf));
    } else {
      await supabase.from('profiles').update(updated).eq('id', user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
