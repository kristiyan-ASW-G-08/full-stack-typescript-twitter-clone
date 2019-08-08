/* eslint-disable import/no-duplicates */
import * as yup from 'yup';
import { StringSchema } from 'yup';

interface TweetValidatorType {
  type: 'text' | 'link' | 'image';
  text: string;
}
const TweetValidator = yup.object<TweetValidatorType>().shape({
  type: yup
    .string()
    .trim()
    .oneOf(['text', 'link', 'image'])
    .required(),
  text: yup
    .string()
    .trim()
    .min(1)
    .max(500)
    .when(
      'type',
      (type: 'text' | 'link' | 'image', schema: StringSchema): any => {
        return type === 'text' ? schema.required() : schema.notRequired();
      },
    ),
  linkUrl: yup
    .string()
    .trim()
    .url()
    .when(
      'type',
      (type: 'text' | 'link' | 'image', schema: StringSchema): any => {
        return type === 'link' ? schema.required() : schema.notRequired();
      },
    ),
});
export default TweetValidator;
