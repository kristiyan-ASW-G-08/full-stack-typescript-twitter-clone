import styled from 'styled-components';

export const Container = styled('section')`
  ${({ theme }) => theme.mixins.center}
  width: 100vw;
  height: 90vh;
`;
export const Title = styled('h1')`
  font-size: 7rem;
  color: ${({ theme }) => theme.primary};
  text-align: center;
  margin: 0;
  padding: 1rem;
`;

export const Subtitle = styled('h2')`
  padding: 1rem;
  font-size: 3rem;
  color: ${({ theme }) => theme.secondary};
  text-align: center;
`;

export const ButtonContainer = styled('div')`
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 3rem;
  grid-gap: 2rem;
`;
