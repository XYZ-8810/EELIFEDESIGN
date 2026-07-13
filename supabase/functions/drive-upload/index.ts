// drive-upload
// 把销售员上传的水单/订金水单/物流证明，真的传到对应的 Google Drive 资料夹

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FOLDER_IDS = {
  bank_slip: '1KQuqyD0kp4NzfXpny70B_uVQ4edVAthU',
  deposit_slip: '1kEzNxUhPu_AtiCdqexX205xHzdt0VPU9',
  logistics_proof: '1fAMFAx_c5YDnt2giNwFHhGnUa66wHua7',
};

function base64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function base64urlFromString(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getAccessToken(serviceAccount) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/drive',
    aud: serviceAccount.token_uri,
    exp: now + 3600,
    iat: now,
  };
  const encHeader = base64urlFromString(JSON.stringify(header));
  const encClaim = base64urlFromString(JSON.stringify(claim));
  const signInput = `${encHeader}.${encClaim}`;

  const pemContents = serviceAccount.private_key
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', binaryDer.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign'],
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(signInput),
  );

  const jwt = `${signInput}.${base64url(signature)}`;

  const resp = await fetch(serviceAccount.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error_description || data.error || 'Google token 交换失败');
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

    const serviceAccount = JSON.parse(Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON'));
    const accessToken = await getAccessToken(serviceAccount);

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
