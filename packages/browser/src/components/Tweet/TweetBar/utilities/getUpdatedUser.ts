import axios from 'axios';
import User from 'types/User';

export const getUpdatedUser = async (
  token: string,
  url: string,
): Promise<User | undefined> => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  };
  const response = await axios.patch(url, {}, config);
  const { user } = response.data.data;
  return user;
};

export default getUpdatedUser;
