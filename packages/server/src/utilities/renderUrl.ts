interface Queries {
  [key: string]: string | number;
}

const generateLink = (
  urlExtension: string,
  queries: Queries | undefined,
): string => {
  const { SERVER_URL } = process.env;
  if (queries) {
    const stringifiedQueries = Object.entries(queries)
      .map(([query, value]): string => `${query}=${value}`)
      .join('&');
    return `${SERVER_URL}/${urlExtension}?${stringifiedQueries}`;
  }

  return `${SERVER_URL}/${urlExtension}`;
};

export default generateLink;
