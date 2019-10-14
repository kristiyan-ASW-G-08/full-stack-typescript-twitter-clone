import styled from 'styled-components';

export const NotificationWrapper = styled('div')`
  position: fixed;
  z-index: 2;
  width: 100vw;
  ${props => props.theme.mixins.flexCenter}
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
  background: ${props =>
    props.notificationType === 'message'
      ? props.theme.primary
      : props.theme.like};
  border-radius: 5px;
  padding: 1rem 2rem 1rem 2rem;
  font-size: 1.2rem;
`;
