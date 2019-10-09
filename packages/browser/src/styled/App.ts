import styled from 'styled-components';
import { setLightness } from 'polished';

export const App = styled('main')`
  background: ${props =>
    props.theme.theme === 'light'
      ? setLightness(0.9, props.theme.background)
      : props.theme.background};
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: 100vh;
`;
export default App;
