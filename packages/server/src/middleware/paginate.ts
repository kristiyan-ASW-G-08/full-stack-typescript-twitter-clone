import { Request, Response, NextFunction } from 'express';
import getSortString from '@utilities/getSortString';

const paginate = (req: Request, _: Response, next: NextFunction): void => {
  const sort = req.query.sort || 'new';
  req.pagination = {
    limit: parseInt(req.query.limit, 10) || 25,
    sort,
    page: parseInt(req.query.page, 10) || 1,
    sortString: getSortString(sort),
  };
  next();
};
export default paginate;
