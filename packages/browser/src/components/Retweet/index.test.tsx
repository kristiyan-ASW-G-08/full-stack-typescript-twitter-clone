import React, { FC, Context, Provider } from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Retweet from './index';
import TestWrapper from 'testUtilities/TestWrapper';
import tweet from 'testUtilities/tweet';

describe('Retweet', () => {
  it('render Retweet', async () => {
    expect.assertions(3);
    const Children: FC = () => (
      <>
        <div data-testid="children"></div>
      </>
    );
    const { container, getByText, getByTestId } = render(
      <Retweet tweet={tweet}>
        <Children />
      </Retweet>,

      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );

    const children = await waitForElement(() => getByTestId('children'));
    const replyText = await waitForElement(() =>
      getByText(`@${tweet.user.handle} Retweeted`),
    );

    expect(container).toBeTruthy();
    expect(children).toBeTruthy();
    expect(replyText).toBeTruthy();
  });
});
