import styled from 'styled-components';

export const PageContainer = styled('div')`
  margin-top: 5vh;
  ${({ theme }) => theme.mixins.center}
  width: 100vw;
  min-height: 90vh;
`;
export default PageContainer;
