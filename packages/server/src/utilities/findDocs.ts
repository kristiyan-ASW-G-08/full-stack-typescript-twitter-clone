//@ts-nocheck
import mongoose, { Model, Document } from 'mongoose';
import Pagination from '../types/Pagination';

const findDocs = async <
  T extends Document,
  Y = { [key: string]: string | mongoose.Types.ObjectId }
>({
  query,
  model,
  pagination: { sortString, limit, page },
}: {
  query: Y;
  model: Model<T>;
  pagination: Pagination;
}): Promise<{
  documents: T[];
  count: number;
}> => {
  const documents = await model
    .countDocuments()
    .find(query)
    .sort(sortString)
    .skip((page - 1) * limit)
    .limit(limit);
  const count = (await model.countDocuments(query)) - page * limit;

  return {
    documents,
    count,
  };
};

export default findDocs;
