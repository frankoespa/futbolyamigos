import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render (): JSX.Element {
        return (
            <Html>
                <Head>
                    <meta charSet="UTF-8" />
                    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                    {/* <link rel='shortcut icon' href='/favicon.ico' type='image/x-icon' /> */ }
                    {/* <link rel='icon' href='/favicon.ico' type='image/x-icon' /> */ }
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;