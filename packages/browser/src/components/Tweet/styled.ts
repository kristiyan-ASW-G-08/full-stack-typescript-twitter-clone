import styled from 'styled-components';

export const StyledTweet = styled('article')`
  width: 100vw;
  background: ${props => props.theme.background};
  ${props => props.theme.mixins.border}
`;

export const UserBar = styled('div')`
  display: grid;
  justify-content: start;
  align-items: center;
  background: red;
`;

export const ContentContainer = styled(`div`)``;
export const Username = styled('h3')`
  color: ${props => props.theme.color};
  font-size: 1.2rem;
`;

export const Text = styled(`p`)``;
