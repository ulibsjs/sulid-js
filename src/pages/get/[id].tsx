import { GetServerSideProps } from '../../../types';

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ctx.params
}

const Id = (props: any) => {
  return (
    <div>
      this is {props.id}
    </div>
  );
};

export default Id;