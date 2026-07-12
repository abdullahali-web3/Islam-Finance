export const palette = {
  green: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    500: '#1B5E20',
    600: '#144D17',
    700: '#0D3B10',
  },
  gold: {
    100: '#FBE9C6',
    500: '#C9971F',
    600: '#A97D14',
  },
  neutral: {
    0: '#FFFFFF',
    50: '#F7F7F5',
    100: '#EDEDEA',
    300: '#C7C7C2',
    500: '#8A8A85',
    700: '#4A4A46',
    900: '#1C1C1A',
  },
};

export type Theme = {
  mode: 'light' | 'dark';
  colors: {
    background: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
    textMuted: string;
    border: string;
  };
  spacing: (n: number) => number;
  radius: { sm: number; md: number; lg: number };
};

const spacing = (n: number) => n * 4;
const radius = { sm: 6, md: 12, lg: 20 };

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: palette.neutral[50],
    surface: palette.neutral[0],
    primary: palette.green[500],
    accent: palette.gold[500],
    text: palette.neutral[900],
    textMuted: palette.neutral[500],
    border: palette.neutral[100],
  },
  spacing,
  radius,
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: palette.neutral[900],
    surface: palette.green[700],
    primary: palette.green[100],
    accent: palette.gold[100],
    text: palette.neutral[50],
    textMuted: palette.neutral[300],
    border: palette.neutral[700],
  },
  spacing,
  radius,
};
