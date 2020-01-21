import React, {
  FC,
  useRef,
  useEffect,
  useState,
  Suspense,
  lazy,
  Dispatch,
  SetStateAction,
} from 'react';
import UserType from 'types/User';
import Feed from 'types/Feed';
import useIntersection from 'hooks/useIntersection';
import FeedBar from 'components/FeedBar';
import TextLoader from 'styled/TextLoader';
import useStores from 'hooks/useStores';
import getUsers from './getUsers';
import { UsersWrapper, Users, Center } from './styled';

const UserCard = lazy(() => import('components/UserCard'));

interface UsersContainerProps {
  url: string;
  setUrl: Dispatch<SetStateAction<string>>;
  feeds: Feed[];
  hasBorderRadius?: boolean;
}
export const UsersContainer: FC<UsersContainerProps> = ({
  url,
  setUrl,
  feeds,
  hasBorderRadius,
}) => {
  const { authStore, notificationStore } = useStores();
  const { authState } = authStore;
  const [users, setUsers] = useState<UserType[]>([]);
  const [nextPage, setNext] = useState<string | null>(null);
  const [query, setQuery] = useState<string>(`${url}?sort=new`);
  const usersRef = useRef(users);
  const nextPageRef = useRef(nextPage);
  const loadNext = async () => {
    try {
      if (nextPageRef?.current) {
        const { nextUsers, next } = await getUsers(nextPageRef.current);
        setUsers([...usersRef.current, ...nextUsers]);
        setNext(next);
      }
    } catch {
      notificationStore.setNotification();
    }
  };
  const { setElement } = useIntersection(loadNext);
  useEffect(() => {
    setQuery(url);
  }, [url]);
  useEffect(() => {
    usersRef.current = users;
    nextPageRef.current = nextPage;
  }, [nextPage, users]);

  useEffect(() => {
    getUsers(query)
      .then(({ nextUsers, next }) => {
        setNext(next);
        setUsers(nextUsers);
      })
      .catch(() => notificationStore.setNotification());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <UsersWrapper hasBorderRadius={hasBorderRadius}>
      <FeedBar currentUrl={url} setUrl={setUrl} feeds={feeds} />
      {users.length > 0 ? (
        <Suspense
          fallback={
            <Users>
              <TextLoader>...Loading</TextLoader>
            </Users>
          }
        >
          <Users role="feed">
            {users.map(user => (
              <UserCard
                key={user._id}
                user={user}
                authState={authState}
                updateUser={authStore.updateUser}
              />
            ))}
          </Users>
        </Suspense>
      ) : (
        ''
      )}

      <Center>
        {nextPage ? (
          <TextLoader ref={(e: HTMLDivElement) => setElement(e)}>
            ...Loading
          </TextLoader>
        ) : (
          <TextLoader>No Users Available</TextLoader>
        )}
      </Center>
    </UsersWrapper>
  );
};
export default UsersContainer;
