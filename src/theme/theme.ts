import { createTheme } from '@mui/material/styles';
import { colors } from './colors';

const theme = createTheme({
  palette: {
    primary: {
      main: colors.brand.primary,
      dark: colors.brand.primaryHover,
    },
    secondary: {
      main: colors.brand.secondary,
      dark: colors.brand.secondaryHover,
    },
    success: { main: colors.status.success },
    warning: { main: colors.status.warning },
    error: { main: colors.status.error },
    info: { main: colors.status.info },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: colors.neutral.text,
      secondary: colors.neutral.textMuted,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
          fontWeight: 600,
          fontSize: '1rem',
          padding: '10px 0',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.brand.primary,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.brand.primary,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: colors.brand.primary,
          },
        },
      },
    },
  },
});

export default theme;
