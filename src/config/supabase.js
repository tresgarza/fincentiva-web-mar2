import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ydnygntfkrleiseuciwq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkbnlnbnRma3JsZWlzZXVjaXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg1NjI0NzAsImV4cCI6MjAyNDEzODQ3MH0.Pu_qDHBbGMX0vZz6qXFxz0UtRoTB6YXtLDVxU-KxB_I';

export const supabase = createClient(supabaseUrl, supabaseKey); 