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
import Sidebar from 'components/Sidebar/Sidebar';
import Loader from 'styled/Loader';
const LoginForm = lazy(() => import('components/LoginForm/LoginForm'));
const SignUpForm = lazy(() => import('components/SignUpForm/SignUpForm'));
const NotFound = lazy(() => import('components/NotFound/NotFound'));
const Router: FC = observer(
  (): JSX.Element => {
    const { themeStore, authStore, sidebarStore } = useContext(
      RootStoreContext,
    );
    const { theme } = themeStore;
    const { isActive } = sidebarStore;
    return (
      <BrowserRouter>
        <>
          <Navbar
            toggleSidebar={() => sidebarStore.toggleSidebar()}
            theme={theme}
            resetAuthState={() => authStore.resetAuthState()}
            toggleTheme={() => themeStore.toggleTheme()}
            authState={authStore.authState}
          />
          <Sidebar
            toggleSidebar={() => sidebarStore.toggleSidebar()}
            theme={theme}
            isActive={isActive}
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
                <Suspense fallback={<Loader />}>
                  <LoginForm {...props} />
                </Suspense>
              )}
            />
            <Route
              exact
              path="/sign-up"
              render={(props: RouteComponentProps): JSX.Element => (
                <Suspense fallback={<Loader />}>
                  <SignUpForm {...props} />
                </Suspense>
              )}
            />
            <Route
              exact
              render={(props: RouteComponentProps): JSX.Element => (
                <Suspense fallback={<Loader />}>
                  <NotFound {...props} />
                </Suspense>
              )}
            />{' '}
          </Switch>
        </>
      </BrowserRouter>
    );
  },
);

export default Router;
