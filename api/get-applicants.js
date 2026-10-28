import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gbotwkyaagcffzvcyzuy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Egi9rMCDbL0BP6R9Mbh_0Q_LxEHau5r";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('eacapplications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.status(200).json(data || []);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return res.status(500).json({ error: 'Failed to fetch applicants', details: error.message });
  }
}
