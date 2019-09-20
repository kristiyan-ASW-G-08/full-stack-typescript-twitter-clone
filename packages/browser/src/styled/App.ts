import styled from 'styled-components';

export const App = styled('div')`
  background: ${props => props.theme.background};
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: 100vh;
`;
export default App;
