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

  if (event.httpMethod === 'GET') {
    try {
      const status = event.queryStringParameters?.status;
      if (status === 'pending') {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('approved', false)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return { statusCode: 200, body: JSON.stringify({ items: data || [] }) };
      }
      return { statusCode: 400, body: 'Unsupported status' };
    } catch (e: any) {
      return { statusCode: 500, body: e.message || 'Server Error' };
    }
  }

  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const body = JSON.parse(event.body || '{}');
    const { action, reviewId } = body as { action: 'approve' | 'delete'; reviewId: number };
    if (!reviewId || !action) return { statusCode: 400, body: 'Missing parameters' };

    if (action === 'approve') {
      const { error } = await supabase.from('reviews').update({ approved: true }).eq('id', reviewId);
      if (error) throw error;
    } else if (action === 'delete') {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
      if (error) throw error;
    }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e: any) {
    return { statusCode: 500, body: e.message || 'Server Error' };
  }
};

export { handler };
