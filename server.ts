import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDb } from './server/db';
import apiRouter from './server/routes';

async function startServer() {
  // Initialize file database & seed records
  initDb();

  const app = express();
  const PORT = 3000;

  // Support 50mb base64 uploads for images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Router first
  app.use('/api', apiRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite Middleware configuration for Development mode
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Dev Server] Mounting Vite Dev Server as middleware...');
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static folder 'dist'
    console.log('[Prod Server] Serving production static bundle from /dist');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Swastik Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
