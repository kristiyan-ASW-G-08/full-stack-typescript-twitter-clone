import React, { FC, memo, useState, useEffect, SyntheticEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { SearchBarWrapper, Datalist } from './styled';
import User from 'types/User';
import UserItem from './UserItem/index';
export const SearchBar: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const getUsers = async (query: string): Promise<void> => {
    try {
      const response = await axios.get(`http://localhost:8090/users/${query}`);
      console.log(response);
      const { users } = response.data.data;
      setUsers(users);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <SearchBarWrapper>
        <input
          type="text"
          list="users"
          placeholder="Search TwittClone"
          onChange={async (e: SyntheticEvent) => {
            const target = e.target as HTMLInputElement;
            const { value } = target;
            console.log(value);
            await getUsers(value);
          }}
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
    </>
  );
};

export default memo(SearchBar);
