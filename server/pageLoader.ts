import { template as coreTemplate } from './teplate';
import { viteServer } from './index';

interface PageLoaderRes {
  template: string,
  Page: any,
  App: any,
  props: any,
}

export const pageLoader = async(url: string, params: Record<string, string>): Promise<PageLoaderRes> => {
  const template = await viteServer.transformIndexHtml(url, coreTemplate);

  const [{ default: Page, getServerSideProps }, { App }] = await Promise.all([
    viteServer.ssrLoadModule(url),
    viteServer.ssrLoadModule('/server/entry.tsx')
  ])

  const props = getServerSideProps ? await getServerSideProps({ params }) : {};

  return { template, App, Page, props };
}