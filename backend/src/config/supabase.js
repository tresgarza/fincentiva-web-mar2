import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase credentials, using default values');
}

const supabaseClient = createClient(supabaseUrl, supabaseKey);

export { supabaseClient as supabase }; 