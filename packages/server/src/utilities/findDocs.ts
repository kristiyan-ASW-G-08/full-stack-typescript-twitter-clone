import mongoose, { Model, Document } from 'mongoose';
import User from '@customTypes/User';
import Tweet from '@customTypes/Tweet';

const findDocs = async <
  T extends Document,
  Y = { [key: string]: string | mongoose.Types.ObjectId }
>(
  model: Model<T>,
  page: number,
  limit: number,
  sortString: string,
  query: Y,
): Promise<{
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
