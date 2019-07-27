import * as yup from 'yup';

interface UserLoginValidator {
  email: string;
  password: string;
}
const UserLoginValidator = yup.object<UserLoginValidator>().shape({
  email: yup
    .string()
    .trim()
    .email()
    .required(),
  password: yup
    .string()
    .trim()
    .min(12)
    .required(),
});

export default UserLoginValidator;
