import path from 'path';
import { build } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { pagesSrc, root, setGlobalData } from './globalData';
import pickUrl from './helpers/pickUrl';
import findPages from './helpers/findPages';
import { OnlySulidConfig } from '../types/SulidConfig';



const { default: config } = require('../sulid.config');
const sulidConfig: OnlySulidConfig = config.sulid ?? {};

setGlobalData({
  port: sulidConfig.port,
  pagesSrc: sulidConfig.pagesSrc,
})

const pagesPath = path.resolve(root, pagesSrc)
const pathUrlPair = pickUrl(findPages(pagesPath), pagesPath)

const inputs = Object.fromEntries(pathUrlPair.map(it => [
  `pages${it.url}`,
  it.path
]));

inputs['pages/index'] = inputs['pages/']
delete inputs['pages/'];

build({
  ...config,
  plugins: [
    ...config.plugins || [],
    solidPlugin({
      ...sulidConfig.solidPlugin,
      ssr: true,
    }),
  ],
  build: {
    minify: true,
    emptyOutDir: false,
    manifest: true,
    rollupOptions: {
      input: {
        'entry': path.resolve(__dirname, 'entry'),
        ...inputs,
      },
      output: {
        dir: `${sulidConfig.build?.output || 'dist'}/client`,
        format: "es",
      }
    }
  },
})

build({
  ...config,
  plugins: [
    ...config.plugins || [],
    solidPlugin({
      ...sulidConfig.solidPlugin,
      ssr: true,
    }),
  ],
  build: {
    minify: true,
    ssr: true,
    emptyOutDir: false,
    manifest: true,
    rollupOptions: {
      input: {
        ...inputs,
        index: path.resolve(__dirname, './serv.js'),
      },
      output: {
        dir: `${sulidConfig.build?.output || 'dist'}/server`,
        format: "cjs"
      }
    }
  },
})
