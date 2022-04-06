import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { red, grey, green } from '@mui/material/colors';

export const ThemeConfigAdmin = createTheme({
    palette: {
        primary: {
            light: grey[50],
            main: '#1B1B1E'
        },
        secondary: {
            main: '#FCB85F'

        },
        error: {
            main: red[500]
        },
        success: {
            main: green[500],
            contrastText: grey[100]
        },
        background: {
            default: grey[200],
            paper: grey[50],
        }
    },
    typography: {
        fontFamily: 'Poppins'
    }
});

export default responsiveFontSizes(ThemeConfigAdmin);