import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// En desarrollo (npm run dev) atiende /api/game igual que la función de Vercel
function apiDevServer() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use('/api/game', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        try {
          let raw = '';
          for await (const chunk of req) raw += chunk;
          const { runAction } = await server.ssrLoadModule('/server/game.js');
          const out = await runAction(JSON.parse(raw || '{}'));
          res.end(JSON.stringify(out));
        } catch (e) {
          res.statusCode = e.status || 500;
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return {
    plugins: [react(), tailwindcss(), apiDevServer()],
  };
})
