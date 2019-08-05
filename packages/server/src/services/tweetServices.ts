import Tweet from '@models/Tweet';

const createTweet = async (text: string, userId: string): Promise<string> => {
  const tweet = new Tweet({
    text,
    user: userId,
  });
  await tweet.save();
  return tweet._id;
};
export default createTweet;
