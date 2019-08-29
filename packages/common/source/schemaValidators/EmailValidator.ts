/* eslint-disable import/no-duplicates */
import * as yup from 'yup';

interface EmailValidatorType {
  email: string;
}
const EmailValidator = yup.object<EmailValidatorType>().shape({
  email: yup
    .string()
    .trim()
    .email()
    .required(),
});
export default EmailValidator;
