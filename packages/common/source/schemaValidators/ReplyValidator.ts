/* eslint-disable import/no-duplicates */
import * as yup from 'yup';

interface ReplyValidatorType {
  text: string;
}
const ReplyValidator = yup.object<ReplyValidatorType>().shape({
  text: yup
    .string()
    .trim()
    .min(1)
    .max(500),
});
export default ReplyValidator;
