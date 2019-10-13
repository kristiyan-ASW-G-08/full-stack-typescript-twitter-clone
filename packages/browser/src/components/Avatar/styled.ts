import styled from 'styled-components';

interface AvatarProps {
  size?: 'small' | 'large' | 'larger';
}
const sizes = {
  small: '2.7rem',
  large: '4rem',
  larger: '8rem',
};
const getSize = (size: 'small' | 'large' | 'larger' = 'small'): string => {
  return sizes[size];
};
export const StyledAvatar = styled('button')<AvatarProps>`
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
StyledAvatar.defaultProps = {
  size: 'small',
};

export default StyledAvatar;
