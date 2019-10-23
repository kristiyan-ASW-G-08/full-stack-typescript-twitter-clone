import React, { FC, lazy, Suspense, useContext } from 'react';
import { Route, Switch, useLocation, useHistory } from 'react-router-dom';
import RootStoreContext from 'stores/RootStore/RootStore';
import Navbar from 'components/Navbar';
import Home from 'pages/Home';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from 'components/Loader/index';
import MobileTweetButton from 'styled/MobileTweetButton';

const LoginPage = lazy(() => import('pages/LoginPage'));
const SignUpPage = lazy(() => import('pages/SignUpPage'));
const TweetPage = lazy(() => import('pages/TweetPage'));
const NotFound = lazy(() => import('pages/NotFound'));
const Profile = lazy(() => import('pages/Profile'));
const EmailConfirmation = lazy(() => import('pages/EmailConfirmation'));
const Modal = lazy(() => import('components/Modal'));
const Portal = lazy(() => import('components/Portal'));
const Notification = lazy(() => import('components/Notification'));
const TweetFormModal = lazy(() => import('components/TweetFormModal'));

const Router: FC = observer(
  (): JSX.Element => {
    const { modalStore, themeStore, authStore, notificationStore } = useContext(
      RootStoreContext,
    );
    const history = useHistory();
    const location = useLocation();
    const { user } = authStore.authState;
    const { theme } = themeStore;
    const { modalState } = modalStore;
    const tweet = location.state && location.state.tweet;
    return (
      <>
        {tweet && (
          <Route
            exact
            path="/tweet/:tweetId"
            render={(): JSX.Element => (
              <Suspense fallback={<Loader />}>
                <Modal
                  backdropHandler={history.goBack}
                  children={
                    <>
                      <TweetPage />
                    </>
                  }
                />
              </Suspense>
            )}
          />
        )}
        {user ? (
          <MobileTweetButton
            onClick={() => modalStore.setModalState('tweetForm')}
          >
            {' '}
            <FontAwesomeIcon icon="feather-alt" />
          </MobileTweetButton>
        ) : (
          ''
        )}
        {modalState.isActive ? (
          <Suspense fallback={<Loader />}>
            <Portal portalId={'modal'} children={<TweetFormModal />} />
          </Suspense>
        ) : (
          ''
        )}
        {notificationStore.notification !== undefined ? (
          <Suspense fallback={<Loader />}>
            <Portal
              portalId={'notification'}
              children={
                <Notification notification={notificationStore.notification} />
              }
            ></Portal>
          </Suspense>
        ) : (
          ''
        )}
        <Navbar
          openModal={() => {
            modalStore.setModalState('tweetForm');
          }}
          theme={theme}
          resetAuthState={() => authStore.resetAuthState()}
          toggleTheme={() => themeStore.toggleTheme()}
          authState={authStore.authState}
        />
        <Switch location={tweet || location}>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/log-in"
            render={(): JSX.Element => (
              <Suspense fallback={<Loader />}>
                <LoginPage />
              </Suspense>
            )}
          />
          <Route
            exact
            path="/sign-up"
            render={(): JSX.Element => (
              <Suspense fallback={<Loader />}>
                <SignUpPage />
              </Suspense>
            )}
          />
          <Route
            exact
            path="/confirmation/:token"
            render={(): JSX.Element => (
              <Suspense fallback={<Loader />}>
                <EmailConfirmation />
              </Suspense>
            )}
          />
          <Route
            exact
            path="/users/:userId"
            render={(): JSX.Element => (
              <Suspense fallback={<Loader />}>
                <Profile />
              </Suspense>
            )}
          />
          <Route
            exact
            render={(): JSX.Element => (
              <Suspense fallback={<Loader />}>
                <NotFound />
              </Suspense>
            )}
          />
        </Switch>
      </>
    );
  },
);

export default Router;
