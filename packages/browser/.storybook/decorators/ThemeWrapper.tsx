import * as React from 'react';
import { makeDecorator } from '@storybook/addons';
import GlobalStyle from '../../src/styled/GlobalStyle';
import { BrowserRouter } from 'react-router-dom';
import Theme from '../../src/components/Theme/Theme';

const ThemeWrapper = makeDecorator({
  name: 'Wrapper',
  parameterName: 'currentTheme',
  wrapper: (storyFn, context, {}) => {
    //@ts-ignore
    const { currentTheme } = context.parameters.options;
    return (
      <>
        <GlobalStyle />
        <Theme theme={currentTheme}>
          <BrowserRouter>{storyFn(context)}</BrowserRouter>
        </Theme>
      </>
    );
  },
});
export default ThemeWrapper;
