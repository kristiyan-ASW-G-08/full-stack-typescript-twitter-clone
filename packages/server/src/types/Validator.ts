import { MixedSchema } from 'yup';

export default interface Validator {
  schema: MixedSchema;
  target: 'body' | 'query' | 'params';
}
