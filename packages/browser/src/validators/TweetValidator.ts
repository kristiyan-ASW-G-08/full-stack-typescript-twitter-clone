/* eslint-disable import/no-duplicates */
import * as yup from 'yup';
import { StringSchema } from 'yup';

//When importing outside of cra's dir there are some files with ts typings that would throw error with this message.
//Error: You may need an appropriate loader to handle this file.
//To avoid ejecting out of cra some files from common will  be copied rather that imported.
//Learn more: https://www.npmjs.com/package/babel-loader-lerna-cra-ts/v/0.1.9-alpha.3

const TweetValidator = yup.object().shape({
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
