import { template as coreTemplate } from './core';
import { viteServer } from './index';
import { urlToFilePath } from './urlToFilePath';

interface PageLoaderRes {
  template: string,
  Page: any,
  App: any,
  props: any,
}

export const pageLoader = async(url: string): Promise<PageLoaderRes> => {
  let template = coreTemplate;

  template = await viteServer.transformIndexHtml(url, template);

  const [{ default: Page, getServerSideProps }, { App }] = await Promise.all([
    viteServer.ssrLoadModule(`/src/pages${urlToFilePath(url)}`),
    viteServer.ssrLoadModule('/server/entry.tsx')
  ])

  const props = getServerSideProps ? await getServerSideProps() : {};

  return { template, App, Page, props };
}