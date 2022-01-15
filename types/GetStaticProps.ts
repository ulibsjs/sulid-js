import { PageContext } from './PageContext';

type GetStaticProps<Props=object> = (pageContext: PageContext) => Props;

export default GetStaticProps;
