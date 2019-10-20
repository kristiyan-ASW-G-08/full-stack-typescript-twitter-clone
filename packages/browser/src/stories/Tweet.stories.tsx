import React from 'react';
import { storiesOf } from '@storybook/react';
import Tweet from 'components/Tweet/index';
import tweet from 'testUtilities/tweet';
import getTime from 'utilities/getTime';

jest.mock('utilities/getTime');
const mockedGetTime = getTime as jest.Mocked<any>;
const deleteTweetHandler = jest.fn();
mockedGetTime.mockReturnValue({ seconds: 0, minutes: 0, hours: 0, days: 0 });

storiesOf('Tweet', module).add(
  'light theme',
  () => (
    <div>
      <Tweet deleteTweetHandler={deleteTweetHandler} tweet={tweet} />
    </div>
  ),
  {
    info: { inline: true },
    options: { currentTheme: 'light' },
  },
);
