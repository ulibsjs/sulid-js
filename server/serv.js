import {pickOneUrl} from "./helpers/pickUrl";
import express from 'express'
import * as solid from 'solid-js/web';
import path from "path";
import { App } from './entry';
import configs from '../sulid.config';

const clientManifest = require('../client/manifest.json')
const entryPath = clientManifest['server/entry.tsx'].file
const accessScript = `<script type="module" src="/${entryPath}">`

export const template = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Vite App</title></head><body><div id="app"><!-- page-html --></div>${accessScript}</script><!-- hydrant --></body></html>`

const port = configs.sulid?.build?.port || 3000;

const app = express()
app.use('/', express.static(path.resolve(__dirname, '../client/')))

const entries = Object.values(require('./manifest'))
  .filter(chunk => chunk.isEntry && /pages/.test(chunk.file))
  .map(it => ({ ...it, url: pickOneUrl(it.src, 'src/pages') }))

entries.forEach((entry) => {
  app.get(entry.url, async (req, res) => {
    const { default: Page, getServerSideProps } = require(path.resolve(__dirname, entry.file))

    const props = {
      ...getServerSideProps ? getServerSideProps({ params: req.params }) : {},
    }

    const pageHTML = solid.renderToString(() => solid.createComponent(App, { props, Page }))

    const html = template
      .replace('<!-- page-html -->', pageHTML)
      .replace('<!-- hydrant -->', solid.generateHydrationScript());

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  })
})

app.listen(port, () => {
  console.log(`Server run on http://localhost:${port}`);
})
