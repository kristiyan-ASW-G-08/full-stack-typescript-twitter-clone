import styled from 'styled-components';

export const IconButton = styled('button')`
  background: none;
  ${props => props.theme.mixins.button};
  font-size: 2.3rem;
  font-weight: bold;
  text-align: center;
  color: ${props => props.theme.primary};
  :hover {
    color: ${props => props.theme.color};
  }
  a {
    color: inherit;
    font-size: inherit;
    text-decoration: none;
    width: 100%;
    height: 100%;
    text-align: center;
  }
`;

export default IconButton;
