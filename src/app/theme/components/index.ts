import { ThemeOverride } from '@chakra-ui/react';

import { buttonTheme } from './button';
import { checkboxTheme } from './checkbox';
import { TableTheme } from './Table';


const components: ThemeOverride['components'] = {
  Button: buttonTheme,
  Checkbox: checkboxTheme,
  Table:TableTheme
};

export default components;
