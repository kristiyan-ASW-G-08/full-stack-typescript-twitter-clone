import React, { FC, memo, useState, SyntheticEvent, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import User from 'types/User';
import getUrl from 'utilities/getUrl';
import RootStoreContext from 'stores/RootStore';
import defaultWarning from 'utilities/defaultWarning';
import { SearchBarWrapper, Datalist } from './styled';
import UserItem from './UserItem/index';

export const SearchBar: FC = () => {
  const { notificationStore } = useContext(RootStoreContext);
  const [users, setUsers] = useState<User[]>([]);
  const getUsers = async (query: string): Promise<void> => {
    try {
      const response = await axios.get(getUrl(`/users/${query}`));
      const { users } = response.data.data;
      setUsers(users);
    } catch (error) {
      notificationStore.setNotification(defaultWarning);
    }
  };
  const searchHandler = async (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    await getUsers(target.value);
  };
  return (
    <SearchBarWrapper role="search" onSubmit={e => e.preventDefault()}>
      <input
        name="file"
        type="search"
        placeholder="Search TwittClone"
        onChange={(e: SyntheticEvent) => searchHandler(e)}
      />
      <Datalist data-testid="datalist">
        {users.map(user => (
          <UserItem user={user} key={user._id} />
        ))}
      </Datalist>
      <span>
        <FontAwesomeIcon icon="search" />
      </span>
    </SearchBarWrapper>
  );
};

export default memo(SearchBar);
