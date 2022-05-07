import styled from 'styled-components';

export const FormLoader = styled('div')`
  width: 100%;
  display: grid;
  place-items: center;
  &:before {
    content: '';
    top: 50%;
    left: 50%;
    width: 1rem;
    height: 1rem;
    border-radius: 100%;
    border: 3px solid ${({ theme }) => theme.secondary};
    border-top-color: ${({ theme }) => theme.primary};
    animation: loading 0.7s linear infinite;
    @keyframes loading {
      to {
        transform: rotate(360deg);
      }
    }
  }
`;
export default FormLoader;
