/* eslint-disable import/no-duplicates */
import * as yup from 'yup';
import { StringSchema } from 'yup';

const TweetValidator = yup.object().shape({
  image: yup.string(),
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
      ): StringSchema<string | undefined> => {
        return type === 'reply' ? schema.required() : schema.notRequired();
      },
    ),
  text: yup
    .string()
    .trim()
    .max(500),
  retweetId: yup
    .string()
    .trim()
    .when(
      'type',
      (
        type: 'text' | 'link' | 'retweet' | 'reply',
        schema: StringSchema,
      ): StringSchema<string | undefined> => {
        return type === 'retweet' ? schema.required() : schema.notRequired();
      },
    ),
  linkUrl: yup
    .string()
    .trim()
    .url(),
});
export default TweetValidator;
