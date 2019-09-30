import styled from 'styled-components';

export const TweetFormWrapper = styled('div')`
  display: grid;
  grid:
    'avatar input input input .' 1fr
    'avatar input input input .' 1fr
    'avatar  input input input .' 1fr
    '. buttons buttons tw-button . ' 2rem/4rem 10fr 10fr 10fr 0.3rem
    ${props => props.theme.mixins.form};
  row-gap: 1rem;
  @media ${props => props.theme.mediaQueries.tablet} {
    width: 50rem;
  }
`;

export const InputContainer = styled('div')`
  grid-area: input;
  display: grid;
  grid-gap: 0.5rem;
`;
export const AvatarContainer = styled('div')`
  grid-area: avatar;
`;

export const ContentButtonsContainer = styled('div')`
  display: grid;
  justify-content: start;
  grid-template-columns: auto auto;
  grid-gap: 2rem;
  grid-area: buttons;
`;
export const TwButtonButtonContainer = styled('div')`
  display: grid;
  justify-content: end;
  grid-area: tw-button;
`;
