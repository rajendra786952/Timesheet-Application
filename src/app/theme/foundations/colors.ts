const colors = {
  primary: {
    100: '#F1F0FF',
    200: '#D6D3FD',
    300: '#5A50E0',
    400: '#3129A3',
    500: '#211C63',
  },

  transparent: 'transparent',
  current: 'currentColor',
  black: '#000000',
  white: '#FFFFFF',

  neutral: {
    100: '#F8FAFC',
    200: '#F1F5F9',
    300: '#E2E8F0',
    400: '#CBD5E1',
    500: '#94A3B8',
    600: '#64748B',
    700: '#1E293B',
  },

  success: {
    100: '#E8FDF3',
    200: '#D1FAE5',
    300: '#10B981',
    400: '#059669',
    500: '#059669',
  },

  warning: {
    100: '#FFFAE5',
    200: '#FEF3C8',
    300: '#FBBF24',
    400: '#D97706',
    500: '#92400E',
  },

  danger: {
    100: '#FEF2F2',
    200: '#FEE2E2',
    300: '#DC2626',
    400: '#B91C1C',
    500: '#7F1D1D',
  },

  purple: {
    100: '#F5F3FF',
    200: '#EDE9FE',
    300: '#8351F5',
    400: '#6D28D9',
    500: '#4C1D95',
  },
  error : {
    100: '#FEF2F2',
    300: '#E54848'
  }

} as const;

export type ColorShades = 100 | 200 | 300 | 400 | 500 | 600 | 700;
export type Colors = `${keyof typeof colors}.${ColorShades}`;

export default colors;
