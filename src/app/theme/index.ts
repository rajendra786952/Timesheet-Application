import { extendTheme, ThemeOverride } from '@chakra-ui/react';

import config from '@/app/theme/config';
import foundations from '@/app/theme/foundations';
import components from '@/app/theme/components';
import styles from '@/app/theme/styles';

const overrides: ThemeOverride = {
  components,
  ...foundations,
  config,
  styles,
};

export default extendTheme(overrides);
