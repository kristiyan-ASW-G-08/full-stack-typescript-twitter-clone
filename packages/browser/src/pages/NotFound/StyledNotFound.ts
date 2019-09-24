import styled from 'styled-components';

export const StyledH1 = styled('h1')`
  font-size: 10rem;
  color: ${props => props.theme.primary};
  text-align: center;
`;

export const StyledH2 = styled('h2')`
  font-size: 6rem;
  color: ${props => props.theme.secondary};
  text-align: center;
`;

export const StyledP = styled('p')`
  font-size: 2rem;
  margin: 2rem;
  color: ${props => props.theme.secondary};
  text-align: center;
`;

export const ButtonContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
`;
