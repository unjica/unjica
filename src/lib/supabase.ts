import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Authentication will not work properly.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if a user is an admin
export async function isAdmin(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;
  
  // Check if the email is the admin email
  const { data, error } = await supabase
    .from('users')
    .select('email, role')
    .eq('id', userId)
    .single();
  
  if (error || !data) return false;
  
  return data.email === 'sanja.malovic2@gmail.com' || data.role === 'ADMIN';
} 