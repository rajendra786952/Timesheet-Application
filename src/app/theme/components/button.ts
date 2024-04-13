import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

import { textStyles } from '@/app/theme/foundations/typography';

const baseStyle = defineStyle({
  borderRadius: 'btn',
  transitionProperty: 'common',
  transitionDuration: 'normal',
  _focusVisible: {
    boxShadow: 'outline',
  },
  _disabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  _hover: {
    _disabled: {
      bg: 'initial',
    },
  },
});

const variantSolid = defineStyle((props) => {
  const { colorScheme: c } = props;

  if (c === 'gray') {
    const bg = mode(`gray.100`, `whiteAlpha.200`)(props);

    return {
      bg,
      color: mode(`gray.800`, `whiteAlpha.900`)(props),
      _hover: {
        bg: mode(`gray.200`, `whiteAlpha.300`)(props),
        _disabled: {
          bg,
        },
      },
      _active: { bg: mode(`gray.300`, `whiteAlpha.400`)(props) },
    };
  }

  const background = `${c}.300`;
  const hoverBg = `${c}.400`;
  const activeBg = `${c}.500`;

  return {
    bg: background,
    color: 'white',
    _hover: {
      bg: hoverBg,
      _disabled: {
        bg: background,
      },
    },
    _active: { bg: activeBg },
  };
});

const variantPrimary = defineStyle(() => {
  const background = 'primary.300';
  const hoverBg = 'primary.400';
  const activeBg = 'primary.500';

  return {
    bg: background,
    color: 'white',
    _hover: {
      bg: hoverBg,
      _disabled: {
        bg: background,
      },
    },
    _active: { bg: activeBg },
  };
});

const variantSecondary = defineStyle(() => {
  const color = 'neutral.600';
  const background = 'neutral.100';
  const hoverBg = 'neutral.200';
  const activeBg = 'neutral.300';

  return {
    color,
    bg: background,
    _hover: {
      bg: hoverBg,
    },
    _active: {
      bg: activeBg,
    },
  };
});

const variantTertiary = defineStyle((props) => {
  const { colorScheme: c } = props;

  let color = 'primary.300';
  let borderColor = color;
  const background = 'white';
  let hoverColor = 'primary.400';
  let hoverBorderColor = 'primary.400';
  let activeColor = 'primary.500';
  let activeBorderColor = 'primary.500';

  if (c === 'gray') {
    color = 'neutral.600';
    borderColor = 'neutral.300';
    hoverColor = 'neutral.700';
    hoverBorderColor = 'neutral.400';
    activeColor = 'neutral.800';
    activeBorderColor = 'neutral.500';
  }

  return {
    color,
    bg: background,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor,
    _hover: {
      color: hoverColor,
      borderColor: hoverBorderColor,
    },
    _active: {
      color: activeColor,
      borderColor: activeBorderColor,
    },
  };
});

const variantOutline = defineStyle((props) => {
  const { colorScheme: c } = props;
  const borderColor = mode(`gray.200`, `whiteAlpha.300`)(props);
  return {
    border: '1px solid',
    borderColor: c === 'gray' ? borderColor : 'currentColor',
    '.chakra-button__group[data-attached][data-orientation=horizontal] > &:not(:last-of-type)': { marginEnd: '-1px' },
    '.chakra-button__group[data-attached][data-orientation=vertical] > &:not(:last-of-type)': { marginBottom: '-1px' },
  };
});

const variantLink = defineStyle((props) => {
  const { colorScheme: c } = props;

  const color = `${c}.300`;
  const hoverColor = `${c}.400`;
  const activeColor = `${c}.500`;

  return {
    padding: 0,
    height: 'auto',
    lineHeight: 'normal',
    verticalAlign: 'baseline',
    color,
    _hover: {
      textDecoration: 'underline',
      color: hoverColor,
      _disabled: {
        textDecoration: 'none',
      },
    },
    _active: {
      color: activeColor,
    },
  };
});

const variantUnstyled = defineStyle({
  bg: 'none',
  color: 'inherit',
  display: 'inline',
  lineHeight: 'inherit',
  m: '0',
  p: '0',
});

const variants = {
  primary: variantPrimary,
  secondary: variantSecondary,
  tertiary: variantTertiary,
  outline: variantOutline,
  solid: variantSolid,
  link: variantLink,
  unstyled: variantUnstyled,
};

const sizes = {
  lg: defineStyle({
    p: '12px 20px',
    h: 'auto',
    ...textStyles.rgMedium,
  }),
  md: defineStyle({
    p: '8px 16px',
    h: 'auto',
    ...textStyles.rgMedium,
  }),
};

export const buttonTheme = defineStyleConfig({
  baseStyle,
  variants,
  sizes,
  defaultProps: {
    variant: 'primary',
    size: 'lg',
    colorScheme: 'primary',
  },
});
