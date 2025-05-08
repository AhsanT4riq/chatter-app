import { useSession } from "@clerk/clerk-expo";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useEffect } from "react";

export function useClerkSupabaseClient(): SupabaseClient | null {
  const { session } = useSession();

  const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Create or update the Supabase client when the token changes
  useEffect(() => {
    const setSupabaseSession = async () => {
      if (!session) return;
      const token = await session.getToken();
      if (token) {
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: "",
        });
      }
    };
    setSupabaseSession();
  }, [session]);

  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      if (session) {
        const token = await session.getToken();
        if (token) {
          await supabase.auth.setSession({
            access_token: token,
            refresh_token: "",
          });
        }
      }
    }, 25 * 60 * 1000); // Refresh every 25 minutes

    return () => clearInterval(refreshInterval);
  }, [session]);

  return supabase;
}
