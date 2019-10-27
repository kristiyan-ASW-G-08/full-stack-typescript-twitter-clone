import React, { FC } from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TestWrapper from 'testUtilities/TestWrapper';
import tweet from 'testUtilities/tweet';
import Retweet from './index';

describe('Retweet', () => {
  it('render Retweet', () => {
    expect.assertions(3);
    const Children: FC = () => (
      <>
        <div data-testid="children" />
      </>
    );
    const { container, getByText, getByTestId } = render(
      <Retweet tweet={tweet}>
        <Children />
      </Retweet>,

      {
        wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>,
      },
    );

    const children = getByTestId('children');
    const replyText = getByText(`@${tweet.user.handle} Retweeted`);

    expect(container).toBeTruthy();
    expect(children).toBeTruthy();
    expect(replyText).toBeTruthy();
  });
});
