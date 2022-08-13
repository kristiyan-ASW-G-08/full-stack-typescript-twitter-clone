import { css } from 'styled-components';

interface BorderProps {
  direction?: 'top' | 'bottom' | 'right' | 'left';
}
const border = css<BorderProps>`
  ${({ direction }) => (direction ? `border-${direction}` : 'border')}: solid
    1px ${({ theme }) => theme.border};
`;

const center = css`
  display: grid;
  place-items: center;
`;
const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const slide = css`
  @keyframes slide {
    from {
      transform: translateX(-100vw);
    }
    to {
      transform: translateX(0);
    }
  }
`;

const button = css`
  cursor: pointer;
  border: none;
  text-decoration: none;
`;

const form = css`
  width: 95vw;
  padding: 2rem;
  background: ${({ theme }) => theme.background};
  ${({ theme }) => theme.mixins.border}
  border-radius: 10px;
`;

const header = css`
  width: 100%;
  height: 20%;
  min-height: 15rem;
`;

const mixins = {
  slide,
  border,
  button,
  form,
  center,
  header,
  flexCenter,
};
export default mixins;
