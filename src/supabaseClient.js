import { createClient } from '@supabase/supabase-js';

// 这个 anon key 是设计成可以公开的（受 Row Level Security 保护），
// 不是密钥，放在前端代码里是 Supabase 官方建议的正常做法。
const SUPABASE_URL = 'https://alfbhqhoawymsoopkjjg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsZmJocWhvYXd5bXNvb3BrampnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NjY0MDUsImV4cCI6MjA5OTI0MjQwNX0.xMNhf_IAd_AOM-1TW7J0ZrAKDCvCXvrMNUO6dkQtyv0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
