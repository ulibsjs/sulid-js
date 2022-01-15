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
  },
  {
    path: '/get/:id',
    getComponent: () => import('../src/pages/test')
  }
]

export const matchParams = /(?<=(^|\/)):(.+?)(?=($|\/))/g

const getServerData = (to: string) => fetch(`/lib/${to}`).then(res => res.json())

export const Route = {
  navigate: async (to: string) => {
    let [props, { default: Page }] = await Promise.all([
      getServerData(to),
      routes.find(
        (route) => RegExp(
          route.path.replace(matchParams, '(.+)')
        ).test(to)
      )!.getComponent(),
    ]);

    setActivePage({ Page, props });
    history.pushState(null, "", to);
  }
}

export const useRoute = () => Route;