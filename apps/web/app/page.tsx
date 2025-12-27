"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { createClient } from '@supabase/supabase-js';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Debug: Check session manually
    const checkSession = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Manual session check in root page:', {
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email
      });
    };
    
    checkSession();

    if (!loading) {
      console.log('Root page effect:', { hasUser: !!user, loading });
      if (user) {
        // User is authenticated, auth provider will handle onboarding redirection
        // Just redirect to myhub and let auth provider handle the rest
        router.push("/myhub");
      } else {
        // User is not authenticated, redirect to login
        console.log('No user found, redirecting to login');
        router.push("/auth/login");
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
