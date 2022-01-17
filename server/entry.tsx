import * as solid from 'solid-js/web';
import { createMemo } from 'solid-js';

export const App = ({  }: any) => {
  return createMemo(() => <p onClick={() => console.log('uwu')}>Hello World!</p>)
};

let dispose: () => void;

const hydrate = async () => {
  if (dispose) dispose();

  dispose = solid.hydrate(
    () => <App />,
    document.getElementById("app")!
  );
};

if (!solid.isServer) hydrate();
