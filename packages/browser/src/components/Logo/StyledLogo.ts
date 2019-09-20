import styled from 'styled-components';

interface StyledLogoProps {
  type: 'horizontal' | 'vertical';
}
export const StyledLogo = styled('div')<StyledLogoProps>`
  display: grid;
  align-content: center;
  ${props =>
    props.type === 'horizontal'
      ? 'grid-template-columns: auto auto'
      : 'grid-template-columns:1fr; justify-items:center '};
  width: 10rem;
  grid-gap: 0.5rem;
`;
export const StyledLogoText = styled('h1')<StyledLogoProps>`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.primary};
  @media ${props => props.theme.mediaQueries.mobile} {
    ${props => (props.type === 'horizontal' ? ' display: none' : '')}
  }
`;

export const StyledLogoSpan = styled('span')`
  font-size: 2rem;
  color: ${props => props.theme.color};
`;