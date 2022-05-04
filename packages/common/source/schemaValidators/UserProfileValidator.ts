import * as yup from 'yup';

const UserProfileValidator = yup.object().shape({
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
});

export default UserProfileValidator;
