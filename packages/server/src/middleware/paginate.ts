import { Request, Response, NextFunction } from 'express';
import getSortString from '@utilities/getSortString';

const paginate = (req: Request, res: Response, next: NextFunction): void => {
  const sort = req.query.sort || 'new';
  const limit = parseInt(req.query.limit, 10) || 25;
  const page = parseInt(req.query.page, 10) || 1;
  const sortString = getSortString(sort);
  req.pagination = {
    limit,
    sort,
    page,
    sortString,
  };
  next();
};
export default paginate;
