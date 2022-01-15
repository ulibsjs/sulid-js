export interface PageContext {
  params: Record<string, string>
}

type GetServerSideProps<Props=object> = (pageContext: PageContext) => Props;

export default GetServerSideProps;
