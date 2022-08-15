import React, { FC, memo, useState, SyntheticEvent, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import User from 'types/User';
import RootStoreContext from 'stores/RootStore';
import { SearchBarWrapper, Datalist } from './styled';
import UserItem from './UserItem/index';

export const SearchBar: FC = () => {
  const { notificationStore } = useContext(RootStoreContext);
  const [users, setUsers] = useState<User[]>([]);
  const searchHandler = async (e: SyntheticEvent) => {
    try {
      const target = e.target as HTMLInputElement;
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/${target.value}`,
      );
      setUsers(response.data?.data?.users);
    } catch (error) {
      notificationStore.setNotification();
    }
  };
  return (
    <SearchBarWrapper role="search">
      <input
        name="file"
        type="search"
        placeholder="Search TwittClone"
        onChange={searchHandler}
      />
      <Datalist data-testid="datalist">
        {users.map(user => (
          <UserItem user={user} key={user._id} />
        ))}
      </Datalist>
      <span>
        <FontAwesomeIcon size="lg" icon="search" />
      </span>
    </SearchBarWrapper>
  );
};

export default memo(SearchBar);
