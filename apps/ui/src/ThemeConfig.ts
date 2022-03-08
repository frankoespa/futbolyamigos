import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { red, grey } from '@mui/material/colors';

export const ThemeConfig = createTheme({
    palette: {
        divider: grey[800],
        primary: {
            light: grey[50],
            main: '#1B1B1E'
        },
        secondary: {
            main: '#FCB85F',

        },
        error: {
            main: red.A400,
        },
        text: {
            primary: grey[50],
            secondary: '#27272B',
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

export default responsiveFontSizes(ThemeConfig);