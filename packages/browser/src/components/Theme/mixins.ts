import { css } from 'styled-components';
import { setLightness } from 'polished';

interface BorderProps {
  direction?: 'top' | 'bottom' | 'right' | 'left';
}
const border = css<BorderProps>`
  ${props => (props.direction ? `border-${props.direction}` : 'border')}: solid
    1px
    ${props =>
      props.theme.theme === 'light'
        ? setLightness(0.8, props.theme.secondary)
        : setLightness(0.2, props.theme.secondary)};
`;

const center = css`
  display: grid;
  place-items: center center;
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
  background: ${props => props.theme.background};
  ${props => props.theme.mixins.border}
  border-radius: 10px;
`;
const mixins = {
  slide,
  border,
  button,
  form,
  center,
  flexCenter,
};
export default mixins;
