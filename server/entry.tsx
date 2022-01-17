import * as solid from 'solid-js/web';
import { createComponent, createMemo, createSignal } from 'solid-js';
import { matchParams, routes } from '../hooks/route';

export const [activePage, setActivePage] = createSignal<{ Page: any, props: any }>({} as any)


export const App = (props: { props: any, Page: any }) => {
  setActivePage({ Page: props.Page, props: props.props })
  return createMemo(() => createComponent(activePage().Page, activePage().props))
};

let dispose: () => void;

const hydrate = async () => {
  if (dispose) dispose();

  let activeRoute = routes.find(
    (route) => RegExp(
      route.path.replace(matchParams, '(.+)')
    ).test(window.location.pathname)
  )!;

  let { default: component } = await activeRoute.getComponent();

  dispose = solid.hydrate(
    () => <App
      props={(window as any).__PROPS__}
      Page={component}
    />,
    document.getElementById("app")!
  );
};

if (!solid.isServer) hydrate();
