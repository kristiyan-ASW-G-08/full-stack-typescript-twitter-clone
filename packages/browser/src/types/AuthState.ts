import User from 'types/User';

export default interface AuthState {
  isAuth: boolean;
  user: User;
  token: string;
}
