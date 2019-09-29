import styled from 'styled-components';

export const StyledTweetForm = styled('div')`
  display: grid;
  grid:
    'avatar input input input .' 1fr
    'avatar input input input .' 1fr
    'avatar  input input input .' 1fr
    '.img-button . tw-button . ' 2rem/4rem 10fr 10fr 10fr 0.3rem
    ${props => props.theme.mixins.form};
  row-gap: 1rem;
  @media ${props => props.theme.mediaQueries.tablet} {
    width: 50rem;
  }
`;

export const InputContainer = styled('div')`
  grid-area: input;
`;
export const AvatarContainer = styled('div')`
  grid-area: avatar;
`;


export const ImgButtonContainer = styled('div')`
  grid-area: img-button;
`;
export const TwButtonButtonContainer = styled('div')`
  display: grid;
  justify-content: end;
  grid-area: tw-button;
`;
export default StyledTweetForm;
