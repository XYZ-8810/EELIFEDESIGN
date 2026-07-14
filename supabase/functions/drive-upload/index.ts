// drive-upload
// 把销售员上传的水单/订金水单/物流证明，真的传到对应的 Google Drive 资料夹
// 用「OAuth 使用者授权」而不是 Service Account —— 因为 Service Account 本身没有储存空间，
// 一般 Gmail/Google 帐号的资料夹又不能用共享云端硬盘，所以改用真人帐号的授权来上传，
// 文件会算在那个 Google 帐号自己的容量里。

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FOLDER_IDS = {
  bank_slip: '1KQuqyD0kp4NzfXpny70B_uVQ4edVAthU',
  deposit_slip: '1kEzNxUhPu_AtiCdqexX205xHzdt0VPU9',
  logistics_proof: '1fAMFAx_c5YDnt2giNwFHhGnUa66wHua7',
  so_pdf: '1FmDdxVUr8WFGfGqLQyPN91xzaGFwbwEy',
  delivery_issue_proof: '1tq-7BSKsfufzK9wSxp8t1BelfKJQCnvI',
};

async function getAccessToken() {
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: Deno.env.get('GOOGLE_OAUTH_CLIENT_ID'),
      client_secret: Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      refresh_token: Deno.env.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
      grant_type: 'refresh_token',
    }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error_description || data.error || 'Google token 刷新失败');
  return data.access_token;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const docType = formData.get('docType');
    const fileName = formData.get('fileName') || (file && file.name) || 'upload';

    const folderId = FOLDER_IDS[docType];
    if (!folderId) return new Response(JSON.stringify({ error: '未知的 docType' }), { status: 400, headers: corsHeaders });
    if (!file) return new Response(JSON.stringify({ error: '没有收到文件' }), { status: 400, headers: corsHeaders });

    const accessToken = await getAccessToken();

    const metadata = { name: fileName, parents: [folderId] };
    const fileBuffer = await file.arrayBuffer();

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelim = `\r\n--${boundary}--`;

    const encoder = new TextEncoder();
    const metaBytes = encoder.encode(delimiter + 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(metadata));
    const fileHeaderBytes = encoder.encode(delimiter + `Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`);
    const closeBytes = encoder.encode(closeDelim);

    const body = new Uint8Array(metaBytes.length + fileHeaderBytes.length + fileBuffer.byteLength + closeBytes.length);
    body.set(metaBytes, 0);
    body.set(fileHeaderBytes, metaBytes.length);
    body.set(new Uint8Array(fileBuffer), metaBytes.length + fileHeaderBytes.length);
    body.set(closeBytes, metaBytes.length + fileHeaderBytes.length + fileBuffer.byteLength);

    const uploadResp = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    });
    const uploadData = await uploadResp.json();
    if (!uploadResp.ok) {
      return new Response(JSON.stringify({ error: uploadData.error?.message || '上传失败' }), { status: 400, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ id: uploadData.id, url: uploadData.webViewLink }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders });
  }
});
