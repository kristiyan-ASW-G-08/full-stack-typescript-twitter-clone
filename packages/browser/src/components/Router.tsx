import React, { FC, lazy, Suspense, useContext } from 'react';
import {
  BrowserRouter,
  Route,
  RouteComponentProps,
  Switch,
} from 'react-router-dom';
import RootStoreContext from 'stores/RootStore/RootStore';
import Navbar from 'components/Navbar';
import Home from 'pages/Home';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sidebar from 'components/Sidebar';
import CenteredLoader from 'components/CenteredLoader';
import MobileTweetButton from 'styled/MobileTweetButton';

const Login = lazy(() => import('pages/LoginPage'));
const SignUpPage = lazy(() => import('pages/SignUpPage'));
const NotFound = lazy(() => import('pages/NotFound'));
const EmailConfirmation = lazy(() => import('pages/EmailConfirmation'));
const Modal = lazy(() => import('components/Modal'));
const Portal = lazy(() => import('components/Portal/Portal'));
const Notification = lazy(() => import('components/Notification'));

const Router: FC = observer(
  (): JSX.Element => {
    const {
      modalStore,
      themeStore,
      authStore,
      sidebarStore,
      notificationStore,
    } = useContext(RootStoreContext);
    const { isAuth } = authStore.authState;
    const { theme } = themeStore;
    const { notification, isNotificationActive } = notificationStore;
    return (
      <BrowserRouter>
        <>
          {isAuth ? (
            <MobileTweetButton
              onClick={() => modalStore.openModal('tweetForm')}
            >
              {' '}
              <FontAwesomeIcon icon="feather-alt" />
            </MobileTweetButton>
          ) : (
            ''
          )}
          {modalStore.isActive ? (
            <Suspense fallback={<CenteredLoader />}>
              <Portal portalId={'modal'} children={<Modal />} />
            </Suspense>
          ) : (
            ''
          )}
          {isNotificationActive ? (
            <Suspense fallback={<CenteredLoader />}>
              <Portal
                portalId={'notification'}
                children={<Notification notification={notification} />}
              ></Portal>
            </Suspense>
          ) : (
            ''
          )}
          <Navbar
            openModal={() => {
              modalStore.openModal('tweetForm');
            }}
            toggleSidebar={() => sidebarStore.toggleSidebar()}
            theme={theme}
            resetAuthState={() => authStore.resetAuthState()}
            toggleTheme={() => themeStore.toggleTheme()}
            authState={authStore.authState}
          />
          <Sidebar
            toggleSidebar={() => sidebarStore.toggleSidebar()}
            theme={theme}
            isActive={sidebarStore.isActive}
            resetAuthState={() => authStore.resetAuthState()}
            toggleTheme={() => themeStore.toggleTheme()}
            authState={authStore.authState}
          />
          <Switch>
            <Route exact path="/" component={Home} />
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
