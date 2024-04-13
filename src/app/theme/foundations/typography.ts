import generateTypographyVariants from '@/app/theme/utils/generateTypographyVariants';

const fontFamily = 'Figtree, Arial, sans-serif';

const commonLg = { fontFamily, fontSize: '18px', lineHeight: '26px' };
const commonMd = { fontFamily, fontSize: '16px', lineHeight: '24px' };
const commonRg = { fontFamily, fontSize: '14px', lineHeight: '20px' };
const commonRg1 = { fontFamily, fontSize: '12px', lineHeight: '20px' };
const commonSm = { fontFamily, fontSize: '12px', lineHeight: '18px' };

export const textStyles = {
  ...generateTypographyVariants(commonLg, 'lg'),
  ...generateTypographyVariants(commonMd, 'md'),
  ...generateTypographyVariants(commonRg, 'rg'),
  ...generateTypographyVariants(commonRg1, 'rg1'),
  ...generateTypographyVariants(commonSm, 'sm'),
};

const typography = {
  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  lineHeights: {
    normal: 'normal',
    none: 1,
    shorter: 1.25,
    short: 1.375,
    base: 1.5,
    tall: 1.625,
    taller: '2',
    '3': '.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '7': '1.75rem',
    '8': '2rem',
    '9': '2.25rem',
    '10': '2.5rem',
  },

  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  fonts: {
    heading:
      fontFamily +
      `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    body:
      fontFamily +
      `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    mono: `SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace`,
  },

  fontSizes: {
    large: '18px',
    '3xs': '0.45rem',
    '2xs': '0.625rem',
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },

  textStyles,
};

export default typography;
