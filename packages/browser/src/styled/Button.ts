import styled from 'styled-components';

interface ButtonProps {
  buttonType: 'primary' | 'secondary';
}
export const Button = styled('button')<ButtonProps>`
  height: 2.7rem;
  width: 8rem;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  color: ${props => props.theme.white};
  border: none;
  border-radius: 3rem;
  background: ${props => {
    const color = props.theme[props.buttonType];
    return color;
  }};
  :hover {
    background: ${props => props.theme.white};
    color: ${props => {
      const color = props.theme[props.buttonType];
      return color;
    }};
    border: solid 1px
      ${props => {
        const color = props.theme[props.buttonType];
        return color;
      }};
  }
`;
export  default Button;
