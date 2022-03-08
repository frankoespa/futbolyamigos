import { Box, Container, Typography } from '@mui/material';
import Head from 'next/head';
import { Nav } from '../src/components/AppBar';
import { About } from '../src/sections/About';
import { Footer } from '../src/sections/Footer';

function Nosotros () {

    return (
        <>
            <Head>
                <title>Nosotros</title>
            </Head>
            <Box sx={{
                minHeight: '100vh',
                backgroundColor: 'secondary.main'
            }}>
                <Nav />
                <Box bgcolor='secondary.main' py={20}>
                    <Container maxWidth="xl">
                        <Typography variant='h3' sx={{ fontWeight: 800, color: 'text.secondary' }} gutterBottom textAlign='center'>Nuestra historia.</Typography>
                        <Typography variant='body1' sx={{ color: 'text.secondary' }} paragraph textAlign='center'>Te contámos un poco sobre nosotros y a lo que aspiramos.</Typography>
                    </Container>
                </Box>
                <About />
                <Footer />
            </Box>
        </>
    );
}

export default Nosotros;