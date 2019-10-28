const common = {
  transparentBackground: 'rgba(136,153,166,0.5)',
  white: '#ffffff',
  primary: '#1da1f2',
};

export const light = {
  ...common,
  theme: 'light',
  secondary: '#657786',
  background: '#ffffff',
  like: '#e0245e',
  color: '#1c2938',
  dark: '#6e8191',
  light: '#e5e9eb',
  border: '#c5cdd3',
};
export const dark = {
  ...common,
  theme: 'dark',
  secondary: '#8899a6',
  background: '#1c2938',
  like: '#e0245e',
  color: '#ffffff',
  dark: '#6d8292',
  light: '#2d425a',
  border: '#2c343a',
};

const themes = {
  light,
  dark,
};
export default themes;
