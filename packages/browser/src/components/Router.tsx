import React, { FC, lazy, Suspense, useContext } from 'react';
import {
  BrowserRouter,
  Route,
  RouteComponentProps,
  Switch,
} from 'react-router-dom';
import RootStoreContext from 'stores/RootStore/RootStore';
import Navbar from 'components/Navbar/Navbar';
import { observer } from 'mobx-react-lite';

const LoginForm = lazy(() => import('components/LoginForm/LoginForm'));
const SignUpForm = lazy(() => import('components/SignUpForm/SignUpForm'));
const Router: FC = observer(
  (): JSX.Element => {
    const { themeStore, authStore } = useContext(RootStoreContext);
    const { theme } = themeStore;
    return (
      <BrowserRouter>
        <>
          <Navbar
            theme={theme}
            resetAuthState={() => authStore.resetAuthState()}
            toggleTheme={() => themeStore.toggleTheme()}
            authState={authStore.authState}
          />
          <Switch>
            <Route exact path="/" component={() => <div>Home</div>} />
            <Route
              exact
              path="/log-in"
              render={(props: RouteComponentProps): JSX.Element => (
                <Suspense fallback={<p>LOading...</p>}>
                  <LoginForm {...props} />
                </Suspense>
              )}
            />
            <Route
              exact
              path="/sign-up"
              render={(props: RouteComponentProps): JSX.Element => (
                <Suspense fallback={<p>LOading...</p>}>
                  <SignUpForm {...props} />
                </Suspense>
              )}
            />
          </Switch>
        </>
      </BrowserRouter>
    );
  },
);

export default Router;