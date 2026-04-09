module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { q, limit = 20 } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing q' });

  const creds = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  const { access_token } = await tokenRes.json();

  const r = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&market=BR&limit=${limit}`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return res.status(200).json(await r.json());
};
