module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { q, limit = 20 } = req.query;
    if (!q) return res.status(400).json({ error: 'Missing q' });

    const creds = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64');

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${creds}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    const tokenText = await tokenRes.text();
    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch(e) {
      return res.status(500).json({ error: 'Token parse failed', raw: tokenText });
    }

    if (!tokenData.access_token) {
      return res.status(500).json({ error: 'No access token', data: tokenData });
    }

    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&market=BR&limit=${limit}`,
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );

    const searchData = await searchRes.json();
    return res.status(200).json(searchData);

  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};
