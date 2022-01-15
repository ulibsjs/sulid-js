import { RequestHandler } from 'express-serve-static-core';
import * as solid from 'solid-js/web';
import { viteServer } from './index';
import { pageLoader } from './pageLoader';

export const template = `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
    <script type="module" src="/server/entry.tsx" defer></script>
    <!-- hydrant -->
    <script>window.__PROPS__ = <!-- props --></script>
  </head>
  <body>
    <div id="app"><!-- page-html --></div>
  </body>
</html>
  `.trim()

export const serverRenderRoute = (): RequestHandler => async (req, res) => {
  try {
    let { template, App, Page, props } = await pageLoader(req.originalUrl)
    const pageHTML = solid.renderToString(() => solid.createComponent(App, { props, Page }))

    const html = template
      .replace('<!-- page-html -->', pageHTML)
      .replace('<!-- props -->', JSON.stringify(props))
      .replace('<!-- hydrant -->', solid.generateHydrationScript());

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e: any) {
    viteServer.ssrFixStacktrace(e);
    console.error(e);
    res.status(500).end(e.message)
  }
}