import styled from 'styled-components';

export const App = styled('main')`
  background: ${({ theme }) =>
    theme.theme === 'light' ? '#e6e6e6' : theme.background};
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: 100vh;
`;
export default App;
