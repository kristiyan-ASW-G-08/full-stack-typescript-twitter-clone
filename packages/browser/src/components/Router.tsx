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
import CenteredLoader from 'components/CenteredLoader';
import Portal from 'components/Portal/Portal';
import Notification from 'components/Notification/Notification';
const Login = lazy(() => import('pages/LoginPage/LoginPage'));
const SignUpPage = lazy(() => import('pages/SignUpPage/SignUpPage'));
const NotFound = lazy(() => import('pages/NotFound/NotFound'));
const EmailConfirmation = lazy(() =>
  import('pages/EmailConfirmation/EmailConfirmation'),
);

const Router: FC = observer(
  (): JSX.Element => {
    const {
      themeStore,
      authStore,
      sidebarStore,
      notificationStore,
    } = useContext(RootStoreContext);
    const { theme } = themeStore;
    const { isActive } = sidebarStore;
    const { notification } = notificationStore;
    return (
      <BrowserRouter>
        <>
          {notification.isActive ? (
            <Portal
              portalId={'notification'}
              children={<Notification notification={notification} />}
            ></Portal>
          ) : (
            ''
          )}
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
                <Suspense fallback={<CenteredLoader />}>
                  <Login {...props} />
                </Suspense>
              )}
            />
            <Route
              exact
              path="/sign-up"
              render={(props: RouteComponentProps): JSX.Element => (
                <Suspense fallback={<CenteredLoader />}>
                  <SignUpPage {...props} />
                </Suspense>
              )}
            />
            <Route
              exact
              path="/confirmation/:token"
              render={(props: RouteComponentProps): JSX.Element => (
                <Suspense fallback={<CenteredLoader />}>
                  <EmailConfirmation {...props} />
                </Suspense>
              )}
            />
            <Route
              exact
              render={(props: RouteComponentProps): JSX.Element => (
                <Suspense fallback={<CenteredLoader />}>
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
