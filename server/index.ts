import express from 'express'
import path from 'path';
import { createServer } from 'vite';
import * as solid from 'solid-js/web';
import fs from 'fs';

const prod = process.argv[2] == 'prod';

createServer({
  server: {
    middlewareMode: 'ssr',
  }
}).then(vite => {
  const app = express();

  app.use(vite.middlewares);

  let coreTemplate = prod
    ? fs.readFileSync(
      path.resolve(__dirname, '../dist/client/index.html'),
      'utf-8'
    )
    : fs.readFileSync(
      path.resolve(__dirname, '../index.html'),
      'utf-8'
    )

  app.use('*', async(req, res) => {
    try {
      const template = await vite.transformIndexHtml(req.originalUrl, coreTemplate);
      const { App } = prod
        ? require('../dist/server/entry')
        : await vite.ssrLoadModule('/server/entry.tsx')

      const pageHTML = solid.renderToString(() => solid.createComponent(App, {}))

      const html = template
        .replace('<!-- page-html -->', pageHTML)
        .replace('<!-- hydrant -->', solid.generateHydrationScript());

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message)
    }
  })

  app.listen(3000, () => {
    if (!prod) console.log(`Development server run on http://localhost:${3000}`);
  })
})
