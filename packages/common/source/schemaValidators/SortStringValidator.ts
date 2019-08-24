import * as yup from 'yup';

interface SortStringValidatorType {
  sort: 'top' | 'trending' | 'new' | 'replies';
  confirmPassword: string;
}

const SortStringValidator = yup.object<SortStringValidatorType>().shape({
  sort: yup
    .string()
    .trim()
    .oneOf(['top', 'trending', 'new', 'replies']),
  limit: yup
    .number()
    .integer()
    .min(1)
    .max(50),
  page: yup
    .number()
    .min(1)
    .integer(),
});

export default SortStringValidator;
