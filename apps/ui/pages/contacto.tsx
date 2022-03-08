import { Box, Container, Typography } from '@mui/material';
import Head from 'next/head';
import { Nav } from '../src/components/AppBar';
import { Contact } from '../src/sections/Contact';
import { Footer } from '../src/sections/Footer';

function Contacto () {

    return (
        <>
            <Head>
                <title>Contacto</title>
            </Head>
            <Box sx={{
                minHeight: '100vh',
                backgroundColor: 'secondary.main'
            }}>
                <Nav />
                <Box bgcolor='secondary.main' py={20}>
                    <Container maxWidth="xl">
                        <Typography variant='h3' sx={{ fontWeight: 800, color: 'text.secondary' }} gutterBottom textAlign='center'>Queremos ayudarte.</Typography>
                        <Typography variant='body1' sx={{ color: 'text.secondary' }} paragraph textAlign='center'>Si deseas obtener información o tienes alguna duda sobre nuestros servicios o torneos, contáctanos por cualquiera de los siguientes medios.</Typography>
                    </Container>
                </Box>
                <Contact />
                <Footer />
            </Box>
        </>
    );
}

export default Contacto;