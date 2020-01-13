import axios from 'axios';
import Tweet from 'types/Tweet';

const getTweets = async (
  url: string,
  token?: string,
): Promise<{
  newTweets: Tweet[];
  next: string | null;
  prev: string | null;
}> => {
  console.log(url);
  const config = token
    ? {
        headers: { Authorization: `bearer ${token}` },
      }
    : {};
  const response = await axios.get(url, config);
  const { links, tweets } = response.data.data;
  const { next, prev } = links;
  return { newTweets: tweets, next, prev };
};

export default getTweets;
