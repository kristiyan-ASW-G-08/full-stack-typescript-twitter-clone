import styled from 'styled-components';

export const TextLoader = styled('div')`
  display: block;
  font-weight: bold;
  text-align: center;
  font-size: 1.7rem;
  width: 100%;
  color: ${({ theme }) => theme.secondary};
`;

export default TextLoader;
