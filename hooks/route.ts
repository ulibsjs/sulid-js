import { setActivePage } from '../server/entry';

interface SingleRoute {
  path: string,
  exact?: boolean,
  getComponent: () => any,
}

export const routes: SingleRoute[] = [
  {
    path: '/',
    exact: true,
    getComponent: () => import('../src/pages')
  },
  {
    path: '/test',
    getComponent: () => import('../src/pages/test')
  }
]

const getServerData = (to: string) => fetch(`/data/${to}`).then(res => res.json())

export const Route = {
  navigate: async (to: string) => {
    let [props, { default: Page }] = await Promise.all([
      getServerData(to),
      routes.find((route) => route.path == to)!.getComponent(),
    ]);

    setActivePage({ Page, props });
    history.pushState(null, "", to);
  }
}

export const useRoute = () => Route;