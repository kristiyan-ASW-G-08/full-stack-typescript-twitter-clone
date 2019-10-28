declare namespace Express {
  interface Request {
    userId: string;
    pagination: {
      limit: number;
      sort: string;
      sortString: string;
      page: number;
    };
  }
}
