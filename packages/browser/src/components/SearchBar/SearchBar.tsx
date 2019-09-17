import React, { FC } from 'react';
import { StyledSearchBar } from './StyledSearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const SearchBar: FC = () => {
  return (
    <StyledSearchBar>
      <input type="text" placeholder="Search TwittClone" />
      <span>
        <FontAwesomeIcon className="nav" icon="search" />
      </span>
    </StyledSearchBar>
  );
};

export default SearchBar;
