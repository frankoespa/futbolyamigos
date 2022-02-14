import { createTheme } from '@mui/material/styles';
import { red, grey } from '@mui/material/colors';

export const ThemeConfig = createTheme({
    // palette: {
    //     divider: grey[800],
    //     primary: {
    //         light: grey[50],
    //         main: '#15151a',
    //     },
    //     secondary: {
    //         main: '#536dfe',
    //     },
    //     error: {
    //         main: red.A400,
    //     },
    //     text: {
    //         primary: grey[50],
    //         secondary: '#1E1E24',
    //     },
    //     background: {
    //         default: grey[200],
    //         paper: grey[50],
    //     },
    // },
    typography: {
        fontFamily: 'Poppins'
    }
});

export default ThemeConfig;