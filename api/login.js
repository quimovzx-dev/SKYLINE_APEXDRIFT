const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // service key — server-side only, never expose to the browser
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { usr_name, passwd } = req.body;

  if (!usr_name || !passwd) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    // Check if user already exists
    const { data: existing, error: findErr } = await supabase
      .from('users')
      .select('*')
      .eq('usr_name', usr_name)
      .maybeSingle();

    if (findErr) throw findErr;

    let gdbp_number;

    if (existing) {
      // Existing user — verify password
      const valid = await bcrypt.compare(passwd, existing.passwd);
      if (!valid) {
        return res.status(401).json({ error: 'Incorrect password.' });
      }
      gdbp_number = existing.gdbp_number;
    } else {
      // New user — register
      const hashed = await bcrypt.hash(passwd, 10);
      const { data: created, error: insertErr } = await supabase
        .from('users')
        .insert({ usr_name, passwd: hashed })
        .select()
        .single();

      if (insertErr) throw insertErr;
      gdbp_number = created.gdbp_number;
    }

    // Log this login as a new session
    await supabase.from('sessions').insert({ gdbp_number });

    return res.status(200).json({ gdbp_number });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error, please try again.' });
  }
};
