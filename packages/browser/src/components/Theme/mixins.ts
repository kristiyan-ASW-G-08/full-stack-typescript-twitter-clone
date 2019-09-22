import { css } from 'styled-components';
import { setLightness } from 'polished';

const border = css`
  border: solid 1px
    ${props =>
      props.theme.currentTheme === 'light'
        ? setLightness(0.8, props.theme.secondary)
        : setLightness(0.2, props.theme.secondary)};
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

const mixins = {
  slide,
  border,
  button,
};
export default mixins;
