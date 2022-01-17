import { ViteDevServer } from 'vite';
import path from 'path';

export let port = 3000;
export let viteServer: ViteDevServer;
export let pagesSrc = './src/pages'
export let root = path.resolve(__dirname, '..')

export const setGlobalData = (props: { pagesSrc?: string, root?: string, port?: number, viteServer?: ViteDevServer }) => {
  if (props.port) port = props.port;
  if (props.viteServer) viteServer = props.viteServer;
  if (props.pagesSrc) pagesSrc = props.pagesSrc;
  if (props.root) root = props.root;
}
