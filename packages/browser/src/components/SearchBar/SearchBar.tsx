import React, { FC } from 'react';
import { SearchBarWrapper } from './styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const SearchBar: FC = () => {
  return (
    <SearchBarWrapper>
      <input type="text" placeholder="Search TwittClone" />
      <span>
        <FontAwesomeIcon icon="search" />
      </span>
    </SearchBarWrapper>
  );
};

export default SearchBar;
