import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uqwlcecptevamcoowxqs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd2xjZWNwdGV2YW1jb293eHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyNDk5NDUsImV4cCI6MjA1MzgyNTk0NX0.1NEA_p_9jsaK8rgsCXM2M8SIibhuxuteZtyo1H6JgeM';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
}); 