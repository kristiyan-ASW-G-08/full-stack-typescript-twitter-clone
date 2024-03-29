import styled from 'styled-components';

export const TweetWrapper = styled('article')`
  width: 100%;
  display: grid;
  grid:
    'avatar user-bar user-bar ' auto
    'avatar . .' 1rem
    '  .   content content' minmax(min-content, max-content)
    'tweet-bar tweet-bar tweet-bar ' 1fr/1fr 7fr 1fr;
  grid-row-gap: 0.3rem;
  background: ${({ theme }) => theme.background};
  ${({ theme }) => theme.mixins.border};
  border-top: none;
  border-left: none;
  border-right: none;
  padding: 1rem 0 1rem;
`;

export const UserBar = styled('div')`
  grid-area: user-bar;
  display: grid;
  grid:
    'username handle time' auto
    'reply reply .' auto/1fr 1fr 1fr;
  grid-gap: 0.5rem;
  align-items: end;
  @media ${({ theme }) => theme.mediaQueries.desktop} {
    grid:
      'username handle time .' auto
      'reply reply . . ' auto/1fr 1fr 1fr 2fr;
  }
`;

export const AvatarContainer = styled('div')`
  ${({ theme }) => theme.mixins.center}
  grid-area: avatar;
`;
export const Username = styled('h3')`
  grid-area: username;
  color: ${({ theme }) => theme.color};
  font-size: 1.4rem;
  font-weight: bold;
`;
export const Handle = styled('h4')`
  grid-area: handle;
  color: ${({ theme }) => theme.dark};
  font-size: 1.2rem;
`;

export const Time = styled('time')`
  grid-area: time;
  color: ${({ theme }) => theme.dark};
  font-size: 1.2rem;
`;

export const ContentContainer = styled('div')`
  grid-area: content;
  width: 100%;
  * {
    margin-bottom: 0.5rem;
    width: 90%;
    font-size: 1.4rem;
  }
  img {
    height: 15rem;
    object-fit: cover;
  }
`;

export const Text = styled('p')`
  display: block;
  color: ${({ theme }) => theme.color};
  overflow-wrap: break-word;
`;

export const Reply = styled('p')`
  grid-area: reply;
  display: block;
  color: ${({ theme }) => theme.secondary};
  font-size: 1.2rem;
  a {
    margin-left: 0.5rem;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.primary};
  }
`;

export const Link = styled('a')`
  display: block;
  color: ${({ theme }) => theme.primary};
`;
