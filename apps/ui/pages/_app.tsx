import { AppProps } from 'next/app';
import Head from 'next/head';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import ThemeConfig from '../src/ThemeConfig';
import 'leaflet/dist/leaflet.css'
import { NotificationManager } from '../src/notifications/NotificationManager';
import { SWRConfig } from 'swr';
import Axios from 'axios';
import { useRouter } from 'next/router';
import LayoutAdmin from '../src/components/LayoutAdmin';
import ThemeConfigAdmin from '../src/ThemeConfigAdmin';
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import "moment/locale/es";

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL_BASE;

function App ({ Component, pageProps }: AppProps) {
    const { pathname } = useRouter();

    if (pathname.includes('/admin'))
    {
        return (
            <ThemeProvider theme={ThemeConfigAdmin}>
                <Head>
                    <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no' />
                </Head>
                <CssBaseline />
                <NotificationManager>
                    <SWRConfig value={{
                        fetcher: url => Axios.get(url).then(res => res.data),
                        shouldRetryOnError: false
                    }}>
                        <LocalizationProvider dateAdapter={AdapterMoment} locale='es'>
                            <LayoutAdmin>
                                <Component {...pageProps} />
                            </LayoutAdmin>
                        </LocalizationProvider>
                    </SWRConfig>
                </NotificationManager>
            </ThemeProvider>
        )
    }

    if (pathname.includes('/login'))
    {
        return (
            <ThemeProvider theme={ThemeConfigAdmin}>
                <Head>
                    <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no' />
                </Head>
                <CssBaseline />
                <NotificationManager>
                    <SWRConfig value={{
                        fetcher: url => Axios.get(url).then(res => res.data),
                        shouldRetryOnError: false
                    }}>
                        <LocalizationProvider dateAdapter={AdapterMoment} locale='es'>
                            <Component {...pageProps} />
                        </LocalizationProvider>
                    </SWRConfig>
                </NotificationManager>
            </ThemeProvider>
        )
    }

    return (
        <ThemeProvider theme={ThemeConfig}>
            <Head>
                <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no' />
            </Head>
            <CssBaseline />
            <NotificationManager>
                <SWRConfig value={{
                    fetcher: url => Axios.get(url).then(res => res.data),
                    shouldRetryOnError: false
                }}>
                    <Component {...pageProps} />
                </SWRConfig>
            </NotificationManager>
        </ThemeProvider>
    );
}
export default App;
