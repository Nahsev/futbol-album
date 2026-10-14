// Función serverless de Vercel: POST /api/game { action, userId, ... }
import { runAction } from '../server/game.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const out = await runAction(body);
    res.status(200).json(out);
  } catch (e) {
    console.error(e);
    res.status(e.status || 500).json({ error: e.status ? e.message : 'Error del servidor: ' + e.message });
  }
}
