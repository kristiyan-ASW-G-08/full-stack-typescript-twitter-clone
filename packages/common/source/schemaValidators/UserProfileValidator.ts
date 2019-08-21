import * as yup from 'yup';

interface UserProfileValidatorType {
  username: string;
  handle: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const UserProfileValidator = yup.object<UserProfileValidatorType>().shape({
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
  website: yup
    .string()
    .trim()
    .url()
    .required(),
});

export default UserProfileValidator;
