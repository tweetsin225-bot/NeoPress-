import { supabase } from "../lib/supabaseClient.js";

export const isSupabaseConfigured = () => Boolean(supabase);

export const getSession = async () => {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session ?? null;
};

export const signInWithPassword = async (email, password) => {
  if (!supabase) {
    return { data: null, error: new Error("Supabase is not configured.") };
  }
  return supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  if (!supabase) return;
  await supabase.auth.signOut();
};

export const onAuthStateChange = (callback) => {
  if (!supabase) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  return supabase.auth.onAuthStateChange(callback);
};
