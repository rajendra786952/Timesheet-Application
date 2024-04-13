import { checkboxAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, cssVar, defineStyle } from '@chakra-ui/styled-system';

import { CustomColorSchemeKeys } from '@/app/theme/types';
import { runIfFn } from '@/app/theme/utils/run-if-fn';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const $size = cssVar('checkbox-size');

const baseStyleControl = defineStyle((props) => {
  const { colorScheme: c } = props;

  const customBaseStyleControl = {
    w: $size.reference,
    h: $size.reference,
    transitionProperty: 'box-shadow',
    transitionDuration: 'normal',
    border: '2px solid',
    borderRadius: 'sm',
    borderColor: 'inherit',
    color: 'white',

    _checked: {
      bg: `${c}.500`,
      borderColor: `${c}.500`,
      color: 'white',

      _hover: {
        bg: `${c}.600`,
        borderColor: `${c}.600`,
      },

      _disabled: {
        borderColor: 'gray.200',
        bg: 'gray.200',
        color: 'gray.500',
      },
    },

    _indeterminate: {
      bg: `${c}.500`,
      borderColor: `${c}.500`,
      color: 'white',
    },

    _disabled: {
      bg: 'gray.100',
      borderColor: 'gray.100',
    },

    _focusVisible: {
      boxShadow: 'none',
    },

    _invalid: {
      borderColor: 'red.500',
    },
  };

  if (Object.keys(CustomColorSchemeKeys).includes(c)) {
    customBaseStyleControl._checked = {
      bg: `${c}.300`,
      borderColor: `${c}.300`,
      color: 'white',

      _hover: {
        bg: `${c}.400`,
        borderColor: `${c}.400`,
      },

      _disabled: {
        borderColor: 'gray.200',
        bg: 'gray.200',
        color: 'gray.500',
      },
    };
  }

  return customBaseStyleControl;
});

const baseStyleContainer = defineStyle({
  _disabled: { cursor: 'not-allowed' },
});

const baseStyleLabel = defineStyle({
  userSelect: 'none',
  _disabled: { opacity: 0.4 },
});

const baseStyleIcon = defineStyle({
  transitionProperty: 'transform',
  transitionDuration: 'normal',
});

const baseStyle = definePartsStyle((props) => ({
  icon: baseStyleIcon,
  container: baseStyleContainer,
  control: runIfFn(baseStyleControl, props),
  label: baseStyleLabel,
}));

const sizes = {
  sm: definePartsStyle({
    control: { [$size.variable]: 'sizes.3' },
    label: { fontSize: 'sm' },
    icon: { fontSize: '3xs' },
  }),
  md: definePartsStyle({
    control: { [$size.variable]: 'sizes.4' },
    label: { fontSize: 'md' },
    icon: { fontSize: '2xs' },
  }),
  lg: definePartsStyle({
    control: { [$size.variable]: 'sizes.5' },
    label: { fontSize: 'lg' },
    icon: { fontSize: '2xs' },
  }),
};

export const checkboxTheme = defineMultiStyleConfig({
  baseStyle,
  sizes,
  defaultProps: {
    size: 'md',
    colorScheme: 'blue',
  },
});
