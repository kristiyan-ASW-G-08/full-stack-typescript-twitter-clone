/* eslint-disable import/no-duplicates */
import * as yup from 'yup';
import { StringSchema } from 'yup';

interface TweetValidatorType {
  type: 'text' | 'link' | 'retweet' | 'reply';
  text: string;
}
const TweetValidator = yup.object<TweetValidatorType>().shape({
  type: yup
    .string()
    .trim()
    .oneOf(['text', 'link', 'retweet', 'reply'])
    .required(),
  replyId: yup
    .string()
    .trim()
    .when(
      'type',
      (
        type: 'text' | 'link' | 'retweet' | 'reply',
        schema: StringSchema,
      ): any => {
        return type === 'reply' ? schema.required() : schema.notRequired();
      },
    ),
  text: yup
    .string()
    .trim()
    .min(1)
    .max(500)
    .when(
      'type',
      (
        type: 'text' | 'link' | 'retweet' | 'reply',
        schema: StringSchema,
      ): any => {
        return type === 'text' ? schema.required() : schema.notRequired();
      },
    ),
  retweetedId: yup
    .string()
    .trim()
    .when(
      'type',
      (
        type: 'text' | 'link' | 'retweet' | 'reply',
        schema: StringSchema,
      ): any => {
        return type === 'retweet' ? schema.required() : schema.notRequired();
      },
    ),
  linkUrl: yup
    .string()
    .trim()
    .url()
    .when(
      'type',
      (
        type: 'text' | 'link' | 'retweet' | 'reply',
        schema: StringSchema,
      ): any => {
        return type === 'link' ? schema.required() : schema.notRequired();
      },
    ),
});
export default TweetValidator;
