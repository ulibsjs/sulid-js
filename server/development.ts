import express from 'express'
import dirTree from 'directory-tree';
import path from 'path';
import { createServer, ViteDevServer } from 'vite';
import { setPropsData } from './setPropsData';
import { pageLoader } from './pageLoader';
import * as solid from 'solid-js/web';

const port = 3000;

export let viteServer: ViteDevServer;

const pagesSrc = 'src'

const root = path.resolve(__dirname, '..')

const pickUrl = (tree: dirTree.DirectoryTree[], pathUrlPair: { path: string, url: string }[], pagesPath: string) => {
  tree.forEach((file) => {
    if (file.children) {
      pickUrl(file.children, pathUrlPair, pagesPath);
    } else {
      pathUrlPair.push({
        path: file.path,
        url: file.path
          .replace(pagesPath, '')
          .replace('index', '')
          .replace(/\[(.*)]/, str => str
            .replace('[', ':')
            .replace(']', '')
          )
          .replace(/\.(tsx|jsx)$/, '')
      });
    }
  })
}

createServer({
  server: { middlewareMode: 'ssr' }
}).then(_viteServer => {
  viteServer = _viteServer;
  const app = express();

  const pagesPath = path.resolve(root, pagesSrc, 'pages')

  const tree = dirTree(pagesPath, {
    extensions: /\.(jsx|tsx)$/,
    exclude: /lib/,
  }).children!;
  const pathUrlPair: { path: string, url: string }[] = [];

  pickUrl(tree, pathUrlPair, pagesPath)

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