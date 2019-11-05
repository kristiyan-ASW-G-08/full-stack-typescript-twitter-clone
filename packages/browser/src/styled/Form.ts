import styled from 'styled-components';

export const FormWrapper = styled('div')`
  ${({ theme }) => theme.mixins.center}
  width: 100vw;
  min-height: 90vh;
`;

export const FieldsWrapper = styled('div')`
  display: grid;
  justify-items: center;
  grid-gap: 1.5rem;
  width: 95vw;
  min-height: 25vh;
  padding: 2rem;
  background: ${({ theme }) => theme.background};
  ${({ theme }) => theme.mixins.border}
  border-radius: 1rem;
  @media ${({ theme }) => theme.mediaQueries.tablet} {
    width: 50rem;
  }
`;
export default FieldsWrapper;
