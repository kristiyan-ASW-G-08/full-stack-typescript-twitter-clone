import * as yup from 'yup';
declare const UserHandleValidator: yup.ObjectSchema<object & {
    handle: string;
}>;
export default UserHandleValidator;
