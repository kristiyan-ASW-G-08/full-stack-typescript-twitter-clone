import React, { FC, lazy, Suspense, useContext } from 'react';
import { Route, Switch, useLocation, useHistory, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RootStoreContext from 'stores/RootStore';
import Navbar from 'components/Navbar';
import Home from 'pages/Home';
import Loader from 'components/Loader/index';
import MobileTweetButton from 'styled/MobileTweetButton';
import PageContainer from 'styled/PageContainer';

const LoginPage = lazy(() => import('pages/LoginPage'));
const SignUpPage = lazy(() => import('pages/SignUpPage'));
const TweetPage = lazy(() => import('pages/TweetPage'));
const NotFound = lazy(() => import('pages/NotFound'));
const UsersPage = lazy(() => import('pages/UsersPage'));
const Profile = lazy(() => import('pages/Profile'));
const EmailConfirmation = lazy(() => import('pages/EmailConfirmation'));
const Modal = lazy(() => import('components/Modal'));
const Portal = lazy(() => import('components/Portal'));
const Notification = lazy(() => import('components/Notification'));
const TweetForm = lazy(() => import('components/TweetForm'));
const UserForm = lazy(() => import('components/UserForm'));

const Router: FC = observer(
  (): JSX.Element => {
    const { themeStore, authStore, notificationStore } = useContext(
      RootStoreContext,
    );
    const history = useHistory();
    const location = useLocation();
    const { user, token } = authStore.authState;
    const { theme } = themeStore;
    const tweet = location.state && location.state.tweet;
    const tweetForm = location.state && location.state.tweetForm;
    const userForm = location.state && location.state.userForm;
    return (
      <>
        {userForm && user && (
          <Route
            exact
            path="/user/edit"
            render={(): JSX.Element => (
              <Suspense fallback={<Loader />}>
                <Portal portalId="user-form">
                  <Modal backdropHandler={history.goBack}>
                    <UserForm />
                  </Modal>
                </Portal>
              </Suspense>
            )}
          />
        )}
        {tweet && (
          <Route
            exact
            path="/tweet/:tweetId"
            render={(): JSX.Element => (
              <Suspense fallback={<Loader />}>
                <Portal portalId="tweet">
                  <Modal backdropHandler={history.goBack}>
                    <TweetPage />
                  </Modal>
                </Portal>
              </Suspense>
            )}
          />
        )}
        {tweetForm && (
          <Route
            exact
            path={[
              '/create/tweet',
              '/update/tweet/:tweetId',
              '/reply/:replyId',
              '/retweet/:retweetId',
            ]}
            render={(): JSX.Element => (
              <Suspense fallback={<Loader />}>
                <Portal portalId="tweet-form">
                  <Modal backdropHandler={history.goBack}>
                    <TweetForm token={token} />
                  </Modal>
                </Portal>
              </Suspense>
            )}
          />
        )}
        {notificationStore.notification !== undefined ? (
          <Suspense fallback={<Loader />}>
            <Portal portalId="notification">
              <Notification notification={notificationStore.notification} />
            </Portal>
          </Suspense>
        ) : (
          ''
        )}
        <Navbar />
        {user ? (
          <Link
            to={{
              pathname: `/create/tweet`,
              state: { tweetForm: location },
            }}
          >
            <MobileTweetButton>
              <FontAwesomeIcon icon="feather-alt" />
            </MobileTweetButton>
          </Link>
        ) : (
          ''
        )}
        <Switch location={userForm || tweetForm || tweet || location}>
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
            path="/tweet/:tweetId"
            render={(): JSX.Element => (
              <Suspense fallback={<Loader />}>
                <PageContainer>
                  <TweetPage />
                </PageContainer>
              </Suspense>
            )}
          />
          <Route
            exact
            path="/users/:userId/:feed/"
            render={(): JSX.Element => (
              <Suspense fallback={<Loader />}>
                <PageContainer>
                  <UsersPage />
                </PageContainer>
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
