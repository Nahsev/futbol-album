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
    let msg = e.status ? e.message : 'Error del servidor: ' + e.message;
    // Atlas corta el TLS cuando la IP no está permitida en Network Access
    if (/SSL alert number 80|tlsv1 alert internal error|Server selection timed out|ECONNREFUSED/i.test(e.message || '')) {
      msg = 'No se pudo conectar a MongoDB Atlas: agregá 0.0.0.0/0 en Atlas → Network Access para permitir a Vercel.';
    }
    res.status(e.status || 500).json({ error: msg });
  }
}
