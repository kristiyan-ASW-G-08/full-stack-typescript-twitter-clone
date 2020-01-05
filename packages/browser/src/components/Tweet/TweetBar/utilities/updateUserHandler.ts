import Notification from 'types/Notification';
import User from 'types/User';
import defaultWarning from 'utilities/defaultWarning';
import getUpdatedUser from './getUpdatedUser';

const updateUserHandler = async (
  token: string,
  urlExtension: string,
  setNotification: (notification: Notification) => void,
  updateUser: (user: User | undefined) => void,
): Promise<void> => {
  try {
    const user = await getUpdatedUser(
      token,
      `${process.env.REACT_APP_URL}/${urlExtension}`,
    );

    updateUser(user);
  } catch (error) {
    setNotification(defaultWarning);
  }
};

export default updateUserHandler;
