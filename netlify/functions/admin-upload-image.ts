import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL as string;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, body: '' } as any;
  const auth = event.headers.authorization || '';
  const role = event.headers['x-user-role'];
  if (!auth.startsWith('Bearer ') || role !== 'admin') return { statusCode: 401, body: 'Unauthorized' };

  try {
    // Handle GET: list items and return optional order

    if (event.httpMethod === 'GET') {
      const bucket = event.queryStringParameters?.bucket;
      if (!bucket) return { statusCode: 400, body: 'Missing bucket' };
      const { data, error } = await supabase.storage.from(bucket).list(undefined, { limit: 100, sortBy: { column: 'name', order: 'asc' } });
      if (error) throw error;
      const items = (data || [])
        .filter((i) => i.name !== 'order.json' && /\.(png|jpe?g|webp|gif|svg)$/i.test(i.name))
        .map((i) => ({ name: i.name, url: supabase.storage.from(bucket).getPublicUrl(i.name).data.publicUrl }));
      // Try to read order.json
      let order: string[] | null = null;
      try {
        const { data: orderFile, error: orderErr } = await supabase.storage.from(bucket).download('order.json');
        if (!orderErr && orderFile) {
          const txt = await orderFile.text();
          const parsed = JSON.parse(txt);
          if (Array.isArray(parsed?.order)) order = parsed.order as string[];
        }
      } catch {
        // ignore
      }
      return { statusCode: 200, body: JSON.stringify({ items, order }) };
    }

    // Handle POST actions (saveOrder or upload)
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      // Support saving order
      if (body?.action === 'saveOrder') {
        const { bucket, order } = body as { bucket: string; order: string[] };
        if (!bucket || !Array.isArray(order)) return { statusCode: 400, body: 'Missing bucket or order' };
        const payload = Buffer.from(JSON.stringify({ order }));
        const { error } = await supabase.storage
          .from(bucket)
          .upload('order.json', payload, { contentType: 'application/json', upsert: true });
        if (error) throw error;
        return { statusCode: 200, body: JSON.stringify({ ok: true }) };
      }

      // Default: upload image
      const { bucket, fileName, fileData, contentType } = body as { bucket: string; fileName: string; fileData: string; contentType?: string };
      if (!bucket || !fileName || !fileData) return { statusCode: 400, body: 'Missing parameters' };
      const base64 = fileData.includes(',') ? fileData.split(',')[1] : fileData;
      const buff = Buffer.from(base64, 'base64');
      const path = `${Date.now()}-${fileName}`;
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, buff, { contentType: contentType || 'application/octet-stream', upsert: false });
      if (upErr) throw upErr;
      const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path);
      return { statusCode: 200, body: JSON.stringify({ publicUrl: publicUrl.publicUrl, path }) };
    }

    if (event.httpMethod === 'DELETE') {
      const body = JSON.parse(event.body || '{}');
      const { bucket, path } = body as { bucket: string; path: string };
      if (!bucket || !path) return { statusCode: 400, body: 'Missing parameters' };
      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) throw error;
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
  } catch (e: any) {
    return { statusCode: 500, body: e.message || 'Server Error' };
  }
};

export { handler };
