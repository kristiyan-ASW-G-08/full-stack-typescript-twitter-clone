import * as yup from 'yup';
declare const SortStringValidator: yup.ObjectSchema<{
    sort: string;
} & {
    sort: string;
    limit: number;
    page: number;
}>;
export default SortStringValidator;
