module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const r = await fetch(`https://api.deezer.com/album/${id}`);
    return res.status(200).json(await r.json());
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};
