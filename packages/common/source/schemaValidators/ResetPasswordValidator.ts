import * as yup from 'yup';

interface UserValidatorType {
  password: string;
  confirmPassword: string;
}
const UserValidator = yup.object<UserValidatorType>().shape({
  confirmPassword: yup
    .string()
    .trim()
    .min(12)
    .oneOf([yup.ref('password')], "Passwords don't match")
    .required(),
});

export default UserValidator;
