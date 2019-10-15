import styled from 'styled-components';

interface FollowButtonWrapperProps {
  buttonText: 'Follow' | 'Following' | 'Unfollow';
}
export const FollowButtonWrapper = styled('button')<FollowButtonWrapperProps>`
  height: 2.7rem;
  min-width: 7rem;
  padding: 0 1rem 0 1rem;
  ${props => props.theme.mixins.button};
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  color: ${props => {
    const colors = {
      Follow: props.theme.primary,
      Unfollow: props.theme.white,
      Following: props.theme.white,
    };
    const color = colors[props.buttonText];
    return color;
  }};
  border-radius: 3rem;
  background: ${props => {
    const colors = {
      Follow: props.theme.white,
      Unfollow: props.theme.like,
      Following: props.theme.primary,
    };
    const color = colors[props.buttonText];
    return color;
  }};

  ${props =>
    props.buttonText === 'Follow'
      ? `border: solid 0.1rem ${props.theme.primary}`
      : ''};
  /* :hover {
    background: ${props => props.theme.white};
  } */
`;

export default FollowButtonWrapper;
