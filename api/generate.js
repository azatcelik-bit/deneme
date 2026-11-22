// Vercel serverless fonksiyonu: API anahtarı sadece burada (sunucuda) durur.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Yalnızca POST' });

  const code = process.env.ACCESS_CODE;
  if (code && req.headers['x-access-code'] !== code) {
    return res.status(401).json({ error: 'Erişim kodu yanlış' });
  }
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: 'GEMINI_API_KEY tanımlı değil' });

  const { prompt, images } = req.body || {};
  if (typeof prompt !== 'string' || !prompt || prompt.length > 40000) {
    return res.status(400).json({ error: 'Geçersiz istek' });
  }
  const imgs = Array.isArray(images) ? images.slice(0, 6) : [];
  const parts = [
    ...imgs.map(data => ({ inlineData: { mimeType: 'image/jpeg', data } })),
    { text: prompt },
  ];
  const model = process.env.MODEL || 'gemini-2.5-flash';

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: { 'x-goog-api-key': key, 'content-type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts }],
          generationConfig: { maxOutputTokens: 8192, temperature: 0.7 },
        }),
      }
    );
    const j = await r.json();
    if (!r.ok) return res.status(r.status === 429 ? 429 : 502).json({ error: j?.error?.message || 'API hatası' });
    const text = (j.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('');
    if (!text) return res.status(502).json({ error: 'Boş yanıt döndü' });
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(502).json({ error: "API'ye ulaşılamadı" });
  }
}
