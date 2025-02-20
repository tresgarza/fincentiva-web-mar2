const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001/api'
  : 'https://financiera-incentiva-backend-0220.vercel.app/api';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export { API_URL, SUPABASE_URL, SUPABASE_ANON_KEY };

export default API_URL; 