import styled from 'styled-components';

interface AvatarProps {
  size?: 'small' | 'large';
}
export const Avatar = styled('button')<AvatarProps>`
  display: grid;
  justify-items: center;
  align-content: center;
  height: ${props => (props.size === 'small' ? '2.7rem' : '4rem')};
  width: ${props => (props.size === 'small' ? '2.7rem' : '4rem')};
  font-size: 1.7rem;
  border: none;
  border-radius: 100%;
  color: ${props => props.theme.secondary};
  background: ${props => props.theme.background};
  image {
    object-fit: cover;
  }
`;

Avatar.defaultProps = {
  size: 'small',
};

export default Avatar;
