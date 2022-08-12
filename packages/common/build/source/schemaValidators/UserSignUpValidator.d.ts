import * as yup from 'yup';
declare const UserValidator: yup.ObjectSchema<object & {
    username: string;
    handle: string;
    email: string;
    password: string;
    confirmPassword: string;
}>;
export default UserValidator;
