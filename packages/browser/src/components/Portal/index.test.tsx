import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Portal from '.';

describe('Portal', () => {
  it('renders', () => {
    expect.assertions(3);
    const id = 'portal';
    const children = <h1>Child Element</h1>;
    const { getByText } = render(<Portal portalId={id} children={children} />);
    const rootElement = document.querySelector(`#${id}`);
    const childElement = getByText('Child Element');

    if (!rootElement) {
      return;
    }

    expect(rootElement).toBeTruthy();
    expect(rootElement.id).toMatch(id);
    expect(childElement).toBeTruthy();
  });
});
