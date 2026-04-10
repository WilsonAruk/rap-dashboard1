module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const id = process.env.SPOTIFY_CLIENT_ID;
    const secret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!id || !secret) {
      return res.status(500).json({ error: 'Vars missing', id: !!id, secret: !!secret });
    }

    const creds = Buffer.from(`${id}:${secret}`).toString('base64');

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${creds}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    const tokenText = await tokenRes.text();
    
    return res.status(200).json({
      tokenStatus: tokenRes.status,
      tokenRaw: tokenText,
      idLength: id.length,
      secretLength: secret.length
    });

  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};
