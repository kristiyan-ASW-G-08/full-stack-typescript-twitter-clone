/* eslint-disable import/no-duplicates */
import * as yup from 'yup';

const TweetValidator = yup.object().shape({
  text: yup
    .string()
    .trim()
    .min(1)
    .max(500),
  linkUrl: yup
    .string()
    .trim()
    .url(),
  file: yup.mixed(),
});
export default TweetValidator;
