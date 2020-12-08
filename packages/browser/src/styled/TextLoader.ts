import styled from 'styled-components';

export const TextLoader = styled('div')`
  display: block;
  font-weight: bold;
  text-align: center;
  font-size:2rem;
  width: 100%;
  color: ${({ theme }) => theme.secondary};
  padding:2rem;
`;

export default TextLoader;
