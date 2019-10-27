import axios from 'axios';
import User from 'types/User';
import Notification from 'types/Notification';

export const getUpdatedUser = async (
  token: string,
  url: string,
  setNotification: (notification: Notification) => void,
): Promise<User | undefined> => {
  try {
    const config = {
      headers: { Authorization: `bearer ${token}` },
    };
    const response = await axios.patch(url, {}, config);
    const { user } = response.data.data;
    return user;
  } catch (err) {
    const notification: Notification = {
      type: 'warning',
      content: 'There was an error. Please try again later.',
    };
    setNotification(notification);
  }
};

export default getUpdatedUser;
