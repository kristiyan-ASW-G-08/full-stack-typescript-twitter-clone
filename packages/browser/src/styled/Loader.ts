import styled from 'styled-components';

export const Loader = styled('div')`
  ::before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    width: 6rem;
    height: 6rem;
    border-radius: 100%;
    border: 3px solid ${props => props.theme.color};
    border-top-color: ${props => props.theme.primary};
    border-bottom-color: ${props => props.theme.primary};
    animation: spinner 0.7s linear infinite;
  }

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default Loader;
