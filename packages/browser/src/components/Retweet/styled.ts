import styled from 'styled-components';

export const RetweetWrapper = styled('article')`
  width: 100%;
`;
export const RetweetMessageWrapper = styled('div')`
  display: flex;
  flex-flow: column;
  align-content: start;
  font-size: 1.2rem;
  padding: 1rem;
  color: ${({ theme }) => theme.dark};
  a {
    color: ${({ theme }) => theme.dark};
    margin-left: 0.5rem;
    font-size: 1.3rem;
  }
`;
export const RetweetText = styled('p')`
  margin-top: 1rem;
  margin-left: 2rem;
  font-size: 1.5rem;
  overflow-wrap: break-word;
`;
