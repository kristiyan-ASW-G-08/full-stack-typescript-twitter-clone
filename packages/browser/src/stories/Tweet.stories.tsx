import React from 'react';
import { storiesOf } from '@storybook/react';
import Tweet from 'components/Tweet/index';
import tweet from 'testUtilities/tweet';

storiesOf('Tweet', module).add(
  'light theme',
  () => (
    <div>
      <Tweet tweet={tweet} />
    </div>
  ),
  {
    info: { inline: true },
    options: { currentTheme: 'light' },
  },
);
