interface PageContext {}

type GetServerSideProps<Props> = (pageContext: PageContext) => Props;

export default GetServerSideProps;
