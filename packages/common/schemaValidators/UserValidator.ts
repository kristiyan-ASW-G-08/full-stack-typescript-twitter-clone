import * as yup from 'yup';

interface UserValidatorType {
  username: string;
  handle: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const UserValidator = yup.object<UserValidatorType>().shape({
  username: yup
    .string()
    .trim()
    .min(1)
    .max(50)
    .required(),
  handle: yup
    .string()
    .trim()
    .min(1)
    .max(50)
    .required(),
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
  confirmPassword: yup
    .string()
    .trim()
    .min(12)
    .oneOf([yup.ref('password')], "Passwords don't match")
    .required(),
});

export default UserValidator;
