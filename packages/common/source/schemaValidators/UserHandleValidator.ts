import * as yup from 'yup';

const UserHandleValidator = yup.object().shape({
  handle: yup
    .string()
    .trim()
    .min(1)
    .max(50)
    .required(),
});

export default UserHandleValidator;
