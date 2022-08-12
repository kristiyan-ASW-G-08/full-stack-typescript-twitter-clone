import * as yup from 'yup';
declare const UserValidator: yup.ObjectSchema<{
    password: string;
    confirmPassword: string;
} & {
    confirmPassword: string;
}>;
export default UserValidator;
