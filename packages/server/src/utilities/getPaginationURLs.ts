import renderUrl from '@utilities/renderUrl';

interface Queries {
  [key: string]: string | number;
}
interface Options {
  page: number;
  urlExtension: string;
  count: number;
  queries: Queries;
}
const getNavigationURLs = ({
  page,
  urlExtension,
  count,
  queries,
}: Options): {
  nextPage: string | null;
  prevPage: string | null;
} => {
  return {
    nextPage:
      count > 0
        ? renderUrl(urlExtension, { ...queries, page: page + 1 })
        : null,
    prevPage:
      page > 1 ? renderUrl(urlExtension, { ...queries, page: page - 1 }) : null,
  };
};

export default getNavigationURLs;
