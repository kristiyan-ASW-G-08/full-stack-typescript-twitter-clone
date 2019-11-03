import styled from 'styled-components';

interface AvatarProps {
  size?: 'small' | 'medium' | 'large';
}
const sizes = {
  small: '2.7rem',
  medium: '4rem',
  large: '8rem',
};
const getSize = (size: 'small' | 'medium' | 'large' = 'small'): string => {
  return sizes[size];
};
export const AvatarWrapper = styled('div')<AvatarProps>`
  ${props => props.theme.mixins.center};
  height: ${props => getSize(props.size)};
  width: ${props => getSize(props.size)};
  border: none;
  border-radius: 100%;
  background: none;
  img {
    border-radius: 100%;
    height: inherit;
    width: inherit;
    object-fit: cover;
  }
`;

export const IconContainer = styled('div')<AvatarProps>`
  font-size: ${props => getSize(props.size)};
  ${props => props.theme.mixins.center}
  width: 100%;
  height: 100%;
  border-radius: 100%;
  color: ${props => props.theme.secondary};
`;
