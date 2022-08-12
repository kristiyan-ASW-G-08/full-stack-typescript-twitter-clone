declare const _default: {
    UserLoginValidator: import("yup").ObjectSchema<object & {
        email: string;
        password: string;
    }>;
    TweetValidator: import("yup").ObjectSchema<object & {
        type: string;
        replyId: string;
        text: string;
        retweetId: string;
        linkUrl: string;
    }>;
    UserSignUpValidator: import("yup").ObjectSchema<object & {
        username: string;
        handle: string;
        email: string;
        password: string;
        confirmPassword: string;
    }>;
    SortStringValidator: import("yup").ObjectSchema<{
        sort: string;
    } & {
        sort: string;
        limit: number;
        page: number;
    }>;
    ResetPasswordValidator: import("yup").ObjectSchema<{
        password: string;
        confirmPassword: string;
    } & {
        confirmPassword: string;
    }>;
    EmailValidator: import("yup").ObjectSchema<{
        email: string;
    } & {
        email: string;
    }>;
    UserHandleValidator: import("yup").ObjectSchema<object & {
        handle: string;
    }>;
    UserProfileValidator: import("yup").ObjectSchema<object & {
        username: string;
        handle: string;
    }>;
};
export default _default;
