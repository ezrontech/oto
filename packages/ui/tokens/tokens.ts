export const tokens = {
  font: {
    size: '16px',
    weightMedium: 500,
    weightNormal: 400,
  },
  radius: {
    base: '0.75rem',
    sm: 'calc(0.75rem - 4px)',
    md: 'calc(0.75rem - 2px)',
    lg: '0.75rem',
    xl: 'calc(0.75rem + 4px)'
  },
  color: {
    background: '#fafafa',
    foreground: '#0a0a0a',
    card: '#ffffff',
    'card-foreground': '#0a0a0a',
    primary: '#0a0a0a',
    'primary-foreground': '#fafafa',
    secondary: '#f5f5f5',
    'secondary-foreground': '#0a0a0a',
    muted: '#f5f5f5',
    'muted-foreground': '#737373',
    accent: '#f5f5f5',
    'accent-foreground': '#0a0a0a',
    destructive: '#ef4444',
    'destructive-foreground': '#fafafa',
    border: '#e5e5e5'
  }
};

export type Tokens = typeof tokens;
