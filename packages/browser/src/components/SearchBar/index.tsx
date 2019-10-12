import React, { FC, memo, useState, useEffect, SyntheticEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { SearchBarWrapper } from './styled';
import User from 'types/User';
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
      <datalist id="users" data-testid="users-list">
        {users.map(user => (
          <option
            key={user._id}
            data-testid={user._id}
            value={`@${user.handle}`}
          />
        ))}
      </datalist>
      <span>
        <FontAwesomeIcon icon="search" />
      </span>
    </SearchBarWrapper>
  );
};

export default memo(SearchBar);
