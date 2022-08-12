import * as yup from 'yup';
declare const UserProfileValidator: yup.ObjectSchema<object & {
    username: string;
    handle: string;
}>;
export default UserProfileValidator;
