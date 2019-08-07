import Tweet from '@models/Tweet';

const createTweet = async (
  text: string,
  userId: string,
): Promise<{ tweetId: string }> => {
  const tweet = new Tweet({
    text,
    user: userId,
    type: 'text',
  });
  await tweet.save();
  const tweetId = tweet._id;
  return { tweetId };
};
export default createTweet;
