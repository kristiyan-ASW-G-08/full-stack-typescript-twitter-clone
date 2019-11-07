import axios from 'axios';
import User from 'types/User';

const getUsers = async (
  url: string,
): Promise<{
  nextUsers: User[];
  next: string | null;
  prev: string | null;
}> => {
  const response = await axios.get(url);
  const { links, users } = response.data.data;
  const { next, prev } = links;
  return { nextUsers: users, next, prev };
};

export default getUsers;
