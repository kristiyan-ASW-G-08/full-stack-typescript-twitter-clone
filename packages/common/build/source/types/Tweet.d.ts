export default interface Tweet {
    type: 'text' | 'link' | 'retweet' | 'reply';
    text: string;
    date: Date;
    retweets: number;
    likes: number;
    replies: number;
    image: string;
    link: string;
}
