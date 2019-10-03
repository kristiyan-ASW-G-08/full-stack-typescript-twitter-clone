import styled from 'styled-components';

interface AvatarProps {
  size?: 'small' | 'large';
}
export const StyledAvatar = styled('button')<AvatarProps>`
  display: grid;
  justify-items: center;
  align-content: center;
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
  width: 100%;
  height: 100%;
  border-radius: 100%;
  font-size: inherit;
  color: ${props =>
    props.theme.theme === 'light' ? props.theme.color : props.theme.background};
  background: ${props =>
    props.theme.theme === 'light' ? props.theme.background : props.theme.color};
`;
StyledAvatar.defaultProps = {
  size: 'small',
};

export default StyledAvatar;
