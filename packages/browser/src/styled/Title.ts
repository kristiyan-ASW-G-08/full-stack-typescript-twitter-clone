import styled from 'styled-components';

export const Container = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  justify-items: center;
`;

export const Title = styled('h1')`
  font-size: 3rem;
  color: ${props => props.theme.primary};
  text-align: center;
`;

export const Subtitle = styled('h2')`
  font-size: 2rem;
  color: ${props => props.theme.secondary};
  text-align: center;
`;

export const Paragraph = styled('p')`
  font-size: 2rem;
  color: ${props => props.theme.secondary};
  text-align: center;
`;
