// accounts-admin
// 处理「新增账号」「重设密码」「删除账号」——这几个操作需要更高权限（service role），
// 不能在浏览器直接执行，所以放在这里、由数据库这端来处理。

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    );

    const body = await req.json();
    const { action } = body;

    if (action === 'create') {
      const { role, name, team, password } = body;
      if (!role || !password) {
        return new Response(JSON.stringify({ error: 'role 和 password 是必填的' }), { status: 400, headers: corsHeaders });
      }
      const email = `user${Date.now()}@eelifedesign.local`;
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email, password, email_confirm: true,
      });
      if (userError) return new Response(JSON.stringify({ error: userError.message }), { status: 400, headers: corsHeaders });

      const { error: profileError } = await supabaseAdmin.from('profiles').insert({
        id: userData.user.id, role, name: name || null, team: team || null, email,
      });
      if (profileError) return new Response(JSON.stringify({ error: profileError.message }), { status: 400, headers: corsHeaders });

      return new Response(JSON.stringify({ id: userData.user.id, role, name, team, email }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'resetPassword') {
      const { userId, newPassword } = body;
      if (!userId || !newPassword) {
        return new Response(JSON.stringify({ error: 'userId 和 newPassword 是必填的' }), { status: 400, headers: corsHeaders });
      }
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password: newPassword });
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'delete') {
      const { userId } = body;
      if (!userId) return new Response(JSON.stringify({ error: 'userId 是必填的' }), { status: 400, headers: corsHeaders });
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'updateTeam') {
      const { userId, team } = body;
      if (!userId || !team) return new Response(JSON.stringify({ error: 'userId 和 team 是必填的' }), { status: 400, headers: corsHeaders });
      const { error } = await supabaseAdmin.from('profiles').update({ team }).eq('id', userId);
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: '未知的 action' }), { status: 400, headers: corsHeaders });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders });
  }
});
