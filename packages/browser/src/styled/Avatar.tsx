import styled from 'styled-components';

export const Avatar = styled('button')`
  display: grid;
  justify-items: center;
  align-content: center;
  height: 2.7rem;
  width: 2.7rem;
  font-size: 1.7rem;
  border: none;
  border-radius: 100%;
  color: ${props => props.theme.secondary};
  background: ${props => props.theme.background};
  image {
    object-fit: cover;
  }
`;
export default Avatar;
