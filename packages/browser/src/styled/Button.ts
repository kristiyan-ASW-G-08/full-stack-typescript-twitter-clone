import styled from 'styled-components';

interface ButtonProps {
  buttonType: 'primary' | 'secondary';
}

export const Button = styled('button')<ButtonProps>`
  ${({ theme }) => theme.mixins.button};
  height: 2.4rem;
  min-width: 7rem;
  padding: 0 0.7rem 0 0.7rem;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  color: ${({ theme }) => theme.white};
  border-radius: 3rem;
  background: ${({ theme, buttonType }) => theme[buttonType]};
  :hover {
    background: ${({ theme }) => theme.white};
    color: ${({ theme, buttonType }) => theme[buttonType]};
  }
  a {
    display: block;
    ${({ theme }) => theme.mixins.center}
    color: inherit;
    font-size: inherit;
    text-decoration: none;
    width: 100%;
    height: 100%;
    text-align: center;
  }
`;

export default Button;
