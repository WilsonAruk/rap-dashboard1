module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const r = await fetch(`https://api.spotify.com/v1/albums/${req.query.id}`, {
    headers: { Authorization: req.headers.authorization },
  });
  return res.status(200).json(await r.json());
};
