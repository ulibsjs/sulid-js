import express from 'express'
import { createServer, ViteDevServer } from 'vite';
import { serverRenderRoute } from './core';
import { setPropsData } from './setPropsData';

const port = 3000;

export let viteServer: ViteDevServer;

createServer({
  server: { middlewareMode: 'ssr' }
}).then(_viteServer => {
  viteServer = _viteServer;
  const app = express();
  app.use(viteServer.middlewares);
  app.use('/data/*', setPropsData)
  app.use("*", serverRenderRoute())

  app.listen(port, () => console.log(`App run on http://localhost:${port}`))
})