import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ThemeButtonProps {
  theme: 'light' | 'dark';
}
export const ThemeButton: FC<ThemeButtonProps> = ({ theme }) => (
  <>
    <span>
      <FontAwesomeIcon icon={theme === 'light' ? 'sun' : 'moon'} />
    </span>
    <p>{theme} Theme</p>
  </>
);

export default ThemeButton;
