import mongoose, { Model } from 'mongoose';
import User from '@customTypes/User';
import Tweet from '@customTypes/Tweet';
import RESTError, { errors } from '@utilities/RESTError';

interface FindQuery {
  name: string;
  value: number | string | mongoose.Types.ObjectId;
}
const getResource = async <T extends User | Tweet>(
  model: Model<T>,
  { value, name }: FindQuery,
  select: string = '',
): Promise<T> => {
  const resource = await model.findOne({ [name]: value }).select(select);
  if (!resource) {
    const { status, message } = errors.NotFound;
    throw new RESTError(status, message);
  }
  return resource;
};

export default getResource;
