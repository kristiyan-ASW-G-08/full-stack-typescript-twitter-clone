import mongoose, { Model, Document } from 'mongoose';
import RESTError, { errors } from './RESTError';
//@@ts-ignore
import { ValidationError } from 'yup';

interface FindQuery {
  name: string;
  value: number | string | mongoose.Types.ObjectId;
}
const getResource = async <T extends Document>(
  model: Model<T>,
  { value, name }: FindQuery,
  select: string = '',
  validationErrors: ValidationError[] | undefined = undefined,
): Promise<T> => {
  //@ts-ignore
  const resource = await model.findOne({ [name]: value }).select(select);
  if (!resource) {
    const { status, message } = errors.NotFound;
    throw new RESTError(status, message, validationErrors);
  }
  return resource;
};

export default getResource;
