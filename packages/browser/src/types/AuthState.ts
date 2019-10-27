import User from 'types/User';

export default interface AuthState {
  user: User | undefined;
  token: string;
}
