import React, { FC, memo, useState, SyntheticEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { SearchBarWrapper, Datalist } from './styled';
import User from 'types/User';
import UserItem from './UserItem/index';
export const SearchBar: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const getUsers = async (query: string): Promise<void> => {
    try {
      const response = await axios.get(`http://localhost:8090/users/${query}`);
      const { users } = response.data.data;
      setUsers(users);
    } catch (error) {}
  };
  const searchHandler = async (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const { value } = target;
    await getUsers(value);
  };
  return (
    <SearchBarWrapper role="search">
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
