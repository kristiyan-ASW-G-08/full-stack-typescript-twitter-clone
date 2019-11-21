interface Queries {
  [key: string]: string | number;
}

const generateLink = (
  baseUrl: string,
  urlExtension: string,
  queries: Queries | undefined,
): string => {
  if (queries) {
    const stringifiedQueries = Object.entries(queries)
      .map(([query, value]): string => `${query}=${value}`)
      .join('&');
    return `${baseUrl}/${urlExtension}?${stringifiedQueries}`;
  }

  return `${baseUrl}/${urlExtension}`;
};

export default generateLink;
