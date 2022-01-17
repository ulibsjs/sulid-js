import { createSignal } from 'solid-js';


const Index = () => {
  const [number, setNumber] = createSignal(0);

  return (
    <div>
      <button onClick={() => {
        setNumber(n => n+1)
        console.log('Clicked!')
      }}>Click me</button>
      <button>Invalid</button>
      <p>You clicked {number()} times</p>
    </div>
  );
};

export default Index;
