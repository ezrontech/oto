"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface User {
    id: string;
    email: string;
    name: string;
    avatar_url: string | null;
    plan: string;
}

interface AuthContextType {
    user: User | null;
    supabaseUser: SupabaseUser | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
    signInWithGoogle: () => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Add timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            console.log('Auth provider timeout reached, setting loading to false');
            setLoading(false);
        }, 5000); // 5 second timeout

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('Initial session check:', {
                hasSession: !!session,
                userId: session?.user?.id,
                email: session?.user?.email
            });
            setSupabaseUser(session?.user ?? null);
            if (session?.user) {
                fetchUserProfile(session.user.id);
            } else {
                console.log('No initial session, setting loading to false');
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state change:', {
                event,
                hasSession: !!session,
                userId: session?.user?.id,
                email: session?.user?.email,
                currentPath: window.location.pathname
            });

            setSupabaseUser(session?.user ?? null);
            if (session?.user) {
                console.log('User authenticated, fetching profile...');
                await fetchUserProfile(session.user.id);
            } else {
                console.log('User not authenticated, clearing user and setting loading to false');
                setUser(null);
                setLoading(false);
            }

            // Reset loading state for sign-in failures
            if (event === 'SIGNED_IN' && !session) {
                console.log('SIGNED_IN event but no session - possible failure');
                setLoading(false);
            }
        });

        return () => {
            clearTimeout(timeout);
            subscription.unsubscribe();
        };
    }, []);

    const fetchUserProfile = async (userId: string) => {
        try {
            console.log('Fetching user profile for:', userId);

            // First try to get user from database
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            console.log('Database query result:', { data: data ? 'User found' : 'User not found', error: error ? error.message : null });

            if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
                throw error;
            }

            if (data) {
                // User exists in database
                console.log('User found in database, checking onboarding status');
                setUser(data);

                // Check if user has completed onboarding
                // Handle case where onboarding_completed field doesn't exist
                const hasCompletedOnboarding = data.onboarding_completed !== undefined ? data.onboarding_completed : false;
                const localStorageCompleted = localStorage.getItem('oto_onboarding_completed') === 'true';

                console.log('Onboarding check:', { hasCompletedOnboarding, localStorageCompleted });

                // If user hasn't completed onboarding in database, always trigger onboarding
                // Database is the source of truth, localStorage can be out of sync
                if (!hasCompletedOnboarding) {
                    console.log('Database shows onboarding not completed, triggering onboarding redirect');
                    // Clear stale localStorage and redirect to onboarding
                    localStorage.removeItem('oto_onboarding_completed');
                    setTimeout(() => {
                        if (window.location.pathname !== '/onboarding') {
                            window.location.href = '/onboarding';
                        }
                    }, 100);
                } else if (!localStorageCompleted && hasCompletedOnboarding) {
                    // Sync localStorage with database
                    localStorage.setItem('oto_onboarding_completed', 'true');
                }
            } else {
                // User exists in auth but not in database (common for Google OAuth users)
                console.log('User not found in database, creating profile...');

                // Create a basic profile for them
                const { data: newUser, error: insertError } = await supabase
                    .from('users')
                    .insert({
                        id: userId,
                        email: supabaseUser?.email,
                        name: supabaseUser?.user_metadata?.name || supabaseUser?.user_metadata?.full_name || 'User',
                        avatar_url: supabaseUser?.user_metadata?.avatar_url || supabaseUser?.user_metadata?.picture,
                        created_at: new Date().toISOString()
                    })
                    .select()
                    .single();

                console.log('Profile creation result:', { success: !insertError, error: insertError?.message });

                if (!insertError && newUser) {
                    setUser(newUser);
                    // Redirect new users to onboarding
                    setTimeout(() => {
                        if (window.location.pathname !== '/onboarding') {
                            window.location.href = '/onboarding';
                        }
                    }, 100);
                } else if (insertError) {
                    console.error('Error creating user profile:', insertError);
                    // Still set basic user info if database fails
                    setUser({
                        id: userId,
                        email: supabaseUser?.email,
                        name: supabaseUser?.user_metadata?.name || supabaseUser?.user_metadata?.full_name || 'User',
                        avatar_url: supabaseUser?.user_metadata?.avatar_url || supabaseUser?.user_metadata?.picture
                    } as any);
                    // Still trigger onboarding for safety
                    if (!localStorage.getItem('oto_onboarding_completed')) {
                        setTimeout(() => {
                            if (window.location.pathname !== '/onboarding') {
                                window.location.href = '/onboarding';
                            }
                        }, 100);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            // Set basic user info from auth if database fails
            setUser({
                id: userId,
                email: supabaseUser?.email,
                name: supabaseUser?.user_metadata?.name || supabaseUser?.user_metadata?.full_name || 'User',
                avatar_url: supabaseUser?.user_metadata?.avatar_url || supabaseUser?.user_metadata?.picture
            } as any);
            // Still trigger onboarding for safety
            if (!localStorage.getItem('oto_onboarding_completed')) {
                setTimeout(() => {
                    if (window.location.pathname !== '/onboarding') {
                        window.location.href = '/onboarding';
                    }
                }, 100);
            }
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error };
    };

    const signUp = async (email: string, password: string, name: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });
        return { error };
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        return { error };
    };

    const signOut = async () => {
        console.log('Sign out initiated...');
        try {
            // First attempt Supabase sign out
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.warn('Supabase sign out error (continuing with local cleanup):', error);
            } else {
                console.log('Supabase sign out successful');
            }
        } catch (error) {
            console.error('Error during sign out process:', error);
        } finally {
            // ALWAYS perform client-side cleanup regardless of server response
            console.log('Performing client-side cleanup...');

            // 1. Clear state
            setUser(null);
            setSupabaseUser(null);

            // 2. Clear all Supabase tokens from localStorage
            // This is critical because supabase.auth.signOut() might fail
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sb-') || key.startsWith('supabase.')) {
                    localStorage.removeItem(key);
                }
            });

            // 3. Clear app-specific data
            localStorage.removeItem('oto_onboarding_completed');
            localStorage.removeItem('oto_onboarding_data');

            console.log('Cleanup complete, redirecting to login');

            // 4. Force redirect to login
            window.location.href = '/';
        }
    };

    const updateProfile = async (data: Partial<User>) => {
        if (!user) return { error: new Error('No user logged in') };

        const { error } = await supabase
            .from('users')
            .update(data)
            .eq('id', user.id);

        if (!error) {
            setUser(prev => prev ? { ...prev, ...data } : null);
        }

        return { error };
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                supabaseUser,
                loading,
                signIn,
                signUp,
                signInWithGoogle,
                signOut,
                updateProfile,
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
