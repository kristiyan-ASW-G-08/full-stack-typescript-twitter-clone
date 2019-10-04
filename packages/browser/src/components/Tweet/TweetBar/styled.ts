import styled from 'styled-components';

import { setLightness } from 'polished';

export const StyledTweetBar = styled('div')`
  grid-area: tweet-bar;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-content: space-evenly;
`;

export const TweetBarButton = styled('button')`
  ${props => props.theme.mixins.button};
  background: none;
  font-size: 1.5rem;
  height: 100%;
  color: ${props => setLightness(0.5, props.theme.secondary)};
  padding: 0.5rem 0 0.5rem 0;
`;
