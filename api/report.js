export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 800,
        temperature: 0.5,
        messages: req.body.messages,
      }),
    });
    const raw = await response.text();
    let data;
    try { data = JSON.parse(raw); } catch(e) {
      return res.status(500).json({ error: 'parse error', raw: raw.slice(0,300) });
    }
    if (!response.ok) return res.status(response.status).json({ error: data.error||'API error', detail: data });
    res.status(200).json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
}
