import * as yup from 'yup';
declare const UserLoginValidator: yup.ObjectSchema<object & {
    email: string;
    password: string;
}>;
export default UserLoginValidator;
