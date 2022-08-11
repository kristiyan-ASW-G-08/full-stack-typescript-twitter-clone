interface Queries {
  [key: string]: string | number;
}

const generateLink = (
  urlExtension: string,
  queries: Queries | undefined,
): string => {
  const { PORT } = process.env;
  if (queries) {
    const stringifiedQueries = Object.entries(queries)
      .map(([query, value]): string => `${query}=${value}`)
      .join('&');
    return `${PORT}/${urlExtension}?${stringifiedQueries}`;
  }

  return `${PORT}/${urlExtension}`;
};

export default generateLink;
