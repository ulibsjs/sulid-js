import { PageContext } from './PageContext';

type GetServerSideProps<Props=object> = (pageContext: PageContext) => Props;

export default GetServerSideProps;
