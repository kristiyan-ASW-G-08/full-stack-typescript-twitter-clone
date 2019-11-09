import user from './user';

const authenticatedAuthState = {
  isAuth: true,
  user: { ...user },
  token: 'mockToken',
};

export default authenticatedAuthState;
