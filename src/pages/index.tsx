import { useRoute } from '../../hooks/route';


const Index = () => {
  return (
    <div onClick={() => useRoute().navigate('/test')}>
      Hello World!
    </div>
  );
};

export default Index;