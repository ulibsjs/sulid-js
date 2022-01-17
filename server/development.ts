import express from 'express'
import path from 'path';
import { createServer } from 'vite';
import { setPropsData } from './setPropsData';
import { pageLoader } from './pageLoader';
import * as solid from 'solid-js/web';
import { pagesSrc, port, root, setGlobalData } from './globalData';
import pickUrl from './helpers/pickUrl';
import solidPlugin from 'vite-plugin-solid';
import { OnlySulidConfig } from '../types/SulidConfig';
import findPages from './helpers/findPages';


const { default: config } = require('../sulid.config');
const sulidConfig: OnlySulidConfig = config.sulid ?? {};

createServer({
  ...config,
  plugins: [
    ...config.plugins || [],
    solidPlugin({
      ...sulidConfig.solidPlugin,
      ssr: true,
    }),
  ],
  server: {
    ...config.server || {},
    middlewareMode: 'ssr',
  }
}).then(viteServer => {
  const app = express();

  setGlobalData({
    viteServer,
    port: sulidConfig.port,
    pagesSrc: sulidConfig.pagesSrc,
  })

  const pagesPath = path.resolve(root, pagesSrc)
  const pathUrlPair = pickUrl(findPages(pagesPath), pagesPath)

  app.use(viteServer.middlewares);
  app.use('/lib/*', setPropsData)

  pathUrlPair.forEach(({ path, url }) => {
    app.get(url, async(req, res) => {
      try {
        let { template, App, Page, props } = await pageLoader(path, req.params)
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
    })
  })

  app.listen(port, () => {
    console.log(`Development server run on http://localhost:${port}`);
  })
})
