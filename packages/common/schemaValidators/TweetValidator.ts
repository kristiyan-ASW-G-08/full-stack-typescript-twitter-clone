import * as yup from 'yup';

interface TweetValidatorType {
  username: string;
  handle: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const TweetValidator = yup.object<TweetValidatorType>().shape({
  text: yup
    .string()
    .trim()
    .min(1)
    .max(100)
    .notRequired(),
});
export default TweetValidator;
