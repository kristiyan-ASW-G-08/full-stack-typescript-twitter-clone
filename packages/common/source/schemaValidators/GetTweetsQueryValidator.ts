import * as yup from 'yup';

interface GetTweetsQueryValidatorType {
  sort: 'top' | 'trending' | 'new' | 'comments';
  confirmPassword: string;
}

const GetTweetsQueryValidator = yup
  .object<GetTweetsQueryValidatorType>()
  .shape({
    sort: yup
      .string()
      .trim()
      .oneOf(['top', 'trending', 'new', 'comments']),
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

export default GetTweetsQueryValidator;
