import styled from 'styled-components';

export const LoaderWrapper = styled('div')`
  ${props => props.theme.mixins.center};
  top: 0;
  position: fixed;
  z-index: 5;
  width: 100vw;
  height: 100vh;
`;

export const Spinner = styled('div')`
  ${props => props.theme.mixins.flexCenter};
  ::before {
    content: '';
    position: absolute;
    width: 6rem;
    height: 6rem;
    border-radius: 100%;
    border: 3px solid ${props => props.theme.color};
    border-top-color: ${props => props.theme.primary};
    border-bottom-color: ${props => props.theme.primary};
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
