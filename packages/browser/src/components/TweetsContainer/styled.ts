import styled from 'styled-components';
import { setLightness } from 'polished';
export const TweetsWrapper = styled('section')`
  width: 100vw;
  display: grid;
  grid:
    '. select . ' auto
    'tweets tweets tweets' auto
    '. loader .' auto/
    0.1rem auto 1fr;
  grid-gap: 1rem;
  padding-top: 1rem;
  @media ${props => props.theme.mediaQueries.desktop} {
    width: 60rem;
    ${props => props.theme.mixins.border}
    border-radius:1rem;
  }
`;
export const Tweets = styled('div')`
  grid-area: tweets;
  width: 100%;
  min-height: 90vh;
`;

export const Loader = styled('p')`
  font-size: 2em;
  grid-area: loader;
  color: ${props => props.theme.primary};
  background: red;
`;
export const Select = styled('select')`
  grid-area: select;
  ${props => props.theme.mixins.button};
  ${props => props.theme.mixins.center};
  text-align: center;
  background: ${props => setLightness(0.3, props.theme.secondary)};
  color: ${props => props.theme.secondary};
  border-radius: 3rem;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.3rem 1.2rem 0.3rem 1.2rem;
  appearance: none;
`;
