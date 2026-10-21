/* ═══════════ Ferreproxim · API proxy (Vercel Serverless) ═══════════
   Mantiene la API key de OpenRouter en el servidor (OPENROUTER_API_KEY).
   El navegador nunca ve la clave.                                      */
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Rate limit simple por IP (por instancia)
const RATE = new Map();
function allowRequest(ip) {
  const now = Date.now();
  const e = RATE.get(ip) || { c: 0, t: now + 60000 };
  if (now > e.t) { e.c = 0; e.t = now + 60000; }
  e.c += 1;
  RATE.set(ip, e);
  if (RATE.size > 3000) { for (const [k, v] of RATE) if (now > v.t) RATE.delete(k); }
  return e.c <= 10;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = String((req.headers['x-forwarded-for'] || '').split(',')[0]).trim() || (req.socket && req.socket.remoteAddress) || 'unknown';
  if (!allowRequest(ip)) return res.status(429).json({ error: 'Demasiadas solicitudes. Inténtalo en un minuto.' });

  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY no configurada en Vercel' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});
  const messages = body.messages;
  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: 'messages requerido' });
  }

  const payload = {
    model: body.model || process.env.OPENROUTER_MODEL || 'minimax/minimax-m3.1-flash:free',
    messages: messages.slice(-12).map(m => ({
      role: ['system', 'user', 'assistant'].includes(m.role) ? m.role : 'user',
      content: String(m.content || '').slice(0, 12000)
    })),
    temperature: typeof body.temperature === 'number' ? body.temperature : 0.2,
    max_tokens: Math.min(Math.max(Number(body.max_tokens) || 1600, 128), 3000),
    reasoning: { exclude: true }
  };

  try {
    const upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
        'HTTP-Referer': process.env.SITE_URL || 'https://ferreproxim.vercel.app',
        'X-Title': 'Ferreproxim · Bermo Ferretería'
      },
      body: JSON.stringify(payload)
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data?.error?.message || 'OpenRouter error' });
    }
    let content = (data.choices?.[0]?.message?.content || '').trim();
    if (!content && data.choices?.[0]?.message?.reasoning) {
      const cand = String(data.choices[0].message.reasoning).replace(/\s+/g, ' ').trim();
      const sentences = cand.split(/(?<=[.?!])\s+/).filter(s => s.length > 20);
      content = sentences[sentences.length - 1] || cand.slice(-400);
    }
    return res.status(200).json({ content, model: payload.model });
  } catch (err) {
    return res.status(502).json({ error: 'No se pudo contactar con OpenRouter' });
  }
};

function safeParse(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
