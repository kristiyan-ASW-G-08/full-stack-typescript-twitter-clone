import axios from 'axios';
import User from 'types/User';
import Notification from 'types/Notification';

export const getUpdatedUser = async (
  isAuth: boolean,
  token: string,
  url: string,
  setNotification: (notification: Notification) => void,
): Promise<User | undefined> => {
  try {
    if (!isAuth) {
      const notification: Notification = {
        type: 'warning',
        content: 'Log in or Sign up to perform this action!',
      };
      setNotification(notification);
      return;
    }
    const config = {
      headers: { Authorization: 'bearer ' + token },
    };
    const response = await axios.patch(url, {}, config);
    const { user } = response.data.data;
    return user;
  } catch (err) {}
};

export default getUpdatedUser;
