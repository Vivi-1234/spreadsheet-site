const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = async (req, res) => {
  const { table, method, data, id, query } = req.body;

  try {
    let result;
    switch (method) {
      case 'select':
        result = await supabase.from(table).select(query || '*');
        break;
      case 'insert':
        result = await supabase.from(table).insert(data);
        break;
      case 'update':
        result = await supabase.from(table).update(data).eq('id', id);
        break;
      case 'delete':
        result = await supabase.from(table).delete().eq('id', id);
        break;
      default:
        return res.status(400).json({ error: 'Invalid method' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
