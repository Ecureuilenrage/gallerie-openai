import { createTheme } from '@mui/material/styles';

/** Thème MUI minimaliste / neutre, typo Inter sans-serif. */
export const theme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#fafafa', paper: '#ffffff' },
    primary: { main: '#111111' },
    text: { primary: '#141414', secondary: '#6b6b6b' },
    divider: 'rgba(0,0,0,0.08)',
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: 'smooth' },
        body: { backgroundColor: '#fafafa' },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
  },
});
