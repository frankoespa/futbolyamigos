import { Box, Button, Container, Grid, Link, Typography } from "@mui/material"
import { Nav } from "../components/AppBar"
import { WhatsApp } from '@mui/icons-material'
export const Hero = () => {
    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundImage: `url('/img-hero.jpg')`,
            position: 'relative'
        }}>
            <Nav />
            <Container maxWidth="xl" sx={{ paddingTop: { xs: 20, md: 30 } }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={6}>
                        <Typography variant='h1' sx={{ fontWeight: 900 }}>Un Torneo.</Typography>
                        <Typography variant='h3' sx={{ fontWeight: 800, color: 'secondary.main' }}>Distinto.</Typography>
                        <Typography variant='h4' sx={{ fontWeight: 300, color: 'secondary.main' }}>Y Con Buenos Amigos.</Typography>
                        <Link href='https://api.whatsapp.com/send?phone=543416103946&text=Quiero%20inscribir%20a%20mi%20equipo' target='_blank' rel="noreferrer" style={{ textDecoration: 'none' }}>
                            <Button variant="contained" startIcon={<WhatsApp />} color='secondary' sx={{
                                marginTop: 5
                            }}>Contactar</Button>
                        </Link>

                    </Grid>
                </Grid>
            </Container>
            <img src="/trazado-ondas.svg" style={{
                position: 'absolute',
                bottom: 0,
                width: '100%'
            }} alt='ondas' />

        </Box>
    )
}