import styled from 'styled-components';

interface AvatarProps {
  size?: 'small' | 'large';
}
export const StyledAvatar = styled('button')<AvatarProps>`
  ${props => props.theme.mixins.center}
  height: ${props => (props.size === 'small' ? '2.7rem' : '4rem')};
  width: ${props => (props.size === 'small' ? '2.7rem' : '4rem')};
  font-size: ${props => (props.size === 'small' ? '2.7rem' : '4rem')};
  border: none;
  border-radius: 100%;
  background: none;
  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

export const IconContainer = styled('div')`
  ${props => props.theme.mixins.center}
  width: 100%;
  height: 100%;
  border-radius: 100%;
  font-size: inherit;
  color: ${props => props.theme.secondary};
`;
StyledAvatar.defaultProps = {
  size: 'small',
};

export default StyledAvatar;
