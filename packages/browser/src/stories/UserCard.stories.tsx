import React from 'react';
import { storiesOf } from '@storybook/react';
import { UserCard } from 'components/UserCard';
import user from 'testUtilities/user';
import authenticatedAuthState from 'testUtilities/authenticatedAuthState';

storiesOf('UserCard', module)
  .add(
    'light theme',
    () => (
      <div style={{ width: '30rem', padding: '1rem' }}>
        <UserCard
          user={user}
          authState={authenticatedAuthState}
          updateUser={() => {}}
        />
      </div>
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'light' },
    },
  )
  .add(
    'dark theme',
    () => (
      <div style={{ width: '30rem', padding: '1rem' }}>
        <UserCard
          user={user}
          authState={authenticatedAuthState}
          updateUser={() => {}}
        />
      </div>
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  );
