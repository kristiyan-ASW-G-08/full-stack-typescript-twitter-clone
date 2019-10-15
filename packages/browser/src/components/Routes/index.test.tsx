import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Routes from './index';
import Theme from 'components/Theme/Theme';

describe('Routes', () => {
  it('unknown urls show 404 page', async () => {
    const history = createMemoryHistory();
    history.push('/unknown-route');
    const { getByText } = render(<Routes />, {
      wrapper: ({ children }) => (
        <Theme theme="light">
          <Router history={history}>{children}</Router>
        </Theme>
      ),
    });

    const h1Heading = await waitForElement(() => getByText('404'));
    const h2Heading = await waitForElement(() => getByText('Page Not Found'));

    expect(h1Heading).toBeTruthy();
    expect(h2Heading).toBeTruthy();
  });
});
