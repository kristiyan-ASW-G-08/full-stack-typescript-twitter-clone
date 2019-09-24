import styled from 'styled-components';

export const Loader = styled('div')`
  &:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60px;
    height: 60px;
    margin-top: -30px;
    margin-left: -30px;
    border-radius: 50%;
    border: 3px solid none;
    border-top-color: ${props => props.theme.primary};
    animation: spinner 0.7s linear infinite;
  }

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default Loader;
