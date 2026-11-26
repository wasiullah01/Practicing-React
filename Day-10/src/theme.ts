import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#5146e5', dark: '#4338ca', light: '#eef2ff' },
    background: { default: '#f6f7fb', paper: '#ffffff' },
    text: { primary: '#172033', secondary: '#64748b' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiTextField: { defaultProps: { size: 'small', fullWidth: true } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 9 },
      },
    },
  },
})

export default theme
