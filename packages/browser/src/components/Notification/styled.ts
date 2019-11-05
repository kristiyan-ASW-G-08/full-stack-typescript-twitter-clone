import styled from 'styled-components';

export const NotificationWrapper = styled('div')`
  position: fixed;
  z-index: 2;
  width: 100vw;
  ${({ theme }) => theme.mixins.flexCenter}
  pointer-events: none;
`;

interface NotificationContentProps {
  notificationType: 'message' | 'warning';
}
export const NotificationContent = styled('p')<NotificationContentProps>`
  pointer-events: auto;
  position: fixed;
  transform: translateY(20vh);
  color: ${props => props.theme.white};
  background: ${({ notificationType, theme }) => {
    const type = {
      message: theme.primary,
      warning: theme.like,
    };
    return type[notificationType];
  }};
  border-radius: 5px;
  padding: 1rem 2rem 1rem 2rem;
  font-size: 1.2rem;
`;
