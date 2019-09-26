import styled from 'styled-components';

export const StyledTweet = styled('article')`
  width: 100vw;
  background: ${props => props.theme.background};
  ${props => props.theme.mixins.border}
`;
