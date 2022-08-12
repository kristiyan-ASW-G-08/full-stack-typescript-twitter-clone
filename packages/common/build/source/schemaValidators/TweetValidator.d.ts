import * as yup from 'yup';
declare const TweetValidator: yup.ObjectSchema<object & {
    type: string;
    replyId: string;
    text: string;
    retweetId: string;
    linkUrl: string;
}>;
export default TweetValidator;
