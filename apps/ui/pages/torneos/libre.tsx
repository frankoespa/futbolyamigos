import { Box, Container, Typography } from '@mui/material';
import Head from 'next/head';
import { Nav } from '../../src/components/AppBar';

function Libre () {


    return (
        <>
            <Head>
                <title>Torneo - Categoría Libre</title>
                <meta name="description" content="Torneo de fútbol amateur en Rosario (Santa Fe) categoría libre " />
            </Head>
            <Box sx={{
                minHeight: '100vh',
                backgroundColor: 'secondary.main'
            }}>
                <Nav />
                <Box bgcolor='secondary.main' py={20}>
                    <Container maxWidth="xl">
                        <Typography variant='body1' sx={{ color: 'text.secondary' }} paragraph textAlign='center'>En construcción....</Typography>
                    </Container>
                </Box>
            </Box>
        </>
    );
}

export default Libre;