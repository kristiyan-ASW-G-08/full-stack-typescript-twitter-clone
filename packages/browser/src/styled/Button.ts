import styled from 'styled-components';

interface ButtonProps {
  buttonType: 'primary' | 'secondary' | 'transparent';
}
export const Button = styled('button')<ButtonProps>`
  height: 2.7rem;
  ${props => (props.buttonType === 'transparent' ? '' : 'width: 8rem')};
  ${props => props.theme.mixins.button};
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  color: ${props => props.theme.white};
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

export default Button;
