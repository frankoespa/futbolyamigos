import { Box, Container, Grid, IconButton, Link, Stack, Typography } from "@mui/material"
import { Facebook, Instagram } from "@mui/icons-material";

export const Footer = () => {
    return (
        <>
            <Box bgcolor='text.secondary' py={10}>
                <Container>
                    <Grid container spacing={5}>
                        <Grid item xs={12} md={4} textAlign='center'>
                            <img src="/main-brand.svg" style={{
                                width: '100px'
                            }} alt='brand-futbolyamigos' />
                            <Typography variant='body2' align="center" sx={{ fontWeight: 300 }}>Fútbol para buenos amigos.</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant='body1' sx={{ fontWeight: 700 }} gutterBottom align="center">Contacto</Typography>
                            <Typography variant='body2' align="center" sx={{ fontWeight: 300 }}>José María Rosa 167 (Rosario - Santa Fe)</Typography>

                            <Typography variant='body2' align="center" sx={{ fontWeight: 300 }}>
                                <Link href='https://api.whatsapp.com/send?phone=543417205422&text=Me%20quiero%20inscribir' target='_blank' rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>341-7205422</Link>
                            </Typography>
                            <Typography variant='body2' align="center" sx={{ fontWeight: 300 }}>futbolyamigos@gmail.com</Typography>

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant='body1' sx={{ fontWeight: 700 }} gutterBottom align="center">Seguínos</Typography>
                            <Stack direction="row" justifyContent='center'>
                                <Link href='https://www.facebook.com/profile.php?id=100077334142489' target='_blank' rel="noreferrer" style={{ textDecoration: 'none' }}>
                                    <IconButton aria-label="facebook" color="secondary">
                                        <Facebook />
                                    </IconButton>
                                </Link>
                                <Link href='https://www.instagram.com/torreonfutbolyamigos/' target='_blank' rel="noreferrer" style={{ textDecoration: 'none' }}>
                                    <IconButton aria-label="instagram" color="secondary">
                                        <Instagram />
                                    </IconButton>
                                </Link>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <Box bgcolor='secondary.main' py={1}>
                <Container maxWidth="xl">
                    <Stack direction="row" justifyContent='center'>
                        <Typography variant='caption' align="center" color='primary'>© {new Date().getFullYear()} Futbol&Amigos. Todos los derechos reservados.</Typography>
                    </Stack>
                </Container>
            </Box>
        </>
    )
}