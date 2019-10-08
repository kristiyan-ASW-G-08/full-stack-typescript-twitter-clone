import axios from 'axios';
import Tweet from 'types/Tweet';
const getTweets = async (
  url: string,
  //@ts-ignore
): Promise<{
  newTweets: Tweet[];
  next: string | null;
  prev: string | null;
}> => {
  try {
    const response = await axios.get(`${url}`);
    console.log(response);
    const { links, tweets } = response.data.data;
    const { next, prev } = links;
    return { newTweets: tweets, next, prev };
  } catch (error) {
    if (error.response) {
    }
  }
};
export default getTweets;
