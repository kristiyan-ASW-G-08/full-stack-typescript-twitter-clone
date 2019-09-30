import styled from 'styled-components';

interface LogoWrapperProps {
  type: 'horizontal' | 'vertical';
}
export const LogoWrapper = styled('div')<LogoWrapperProps>`
  display: grid;
  align-content: center;
  ${props =>
    props.type === 'horizontal'
      ? 'grid-template-columns: auto auto'
      : 'grid-template-columns:1fr; justify-items:center '};
  width: 10rem;
  grid-gap: 0.5rem;
`;
export const LogoText = styled('h1')<LogoWrapperProps>`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.primary};
  @media ${props => props.theme.mediaQueries.mobile} {
    ${props => (props.type === 'horizontal' ? ' display: none' : '')}
  }
`;

export const LogoSpan = styled('span')`
  font-size: 2rem;
  color: ${props => props.theme.color};
`;
