import { Box, Container, Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { Check } from "@mui/icons-material"

export const About = () => {
    return (
        <Box bgcolor='text.secondary' py={15}>
            <Container maxWidth="xl">
                <Grid container spacing={5}>
                    <Grid item xs={12} md={6}>
                        <Typography variant='h3' sx={{ fontWeight: 800 }} gutterBottom align="center">Nosotros</Typography>
                        <Typography variant='body1' paragraph align="center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta aliquid quis laborum nisi neque, quasi sequi quia culpa omnis, laboriosam doloribus accusamus provident doloremque magni a error id. Voluptates, esse! Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, odit? At, culpa. Porro deleniti quod ipsum modi amet, blanditiis temporibus autem illum repellendus veritatis laboriosam beatae consectetur nesciunt corrupti ducimus.</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='h3' sx={{ fontWeight: 800 }} gutterBottom align="center">Nuestros <Typography component='span' color='secondary.main' variant='h3' sx={{ fontWeight: 800 }}>Valores</Typography></Typography>

                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <Check color="secondary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant='body1'>Orientación hacia el servicio.</Typography>}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Check color="secondary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant='body1'>Responsabilidad.</Typography>}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Check color="secondary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant='body1'>Compromiso.</Typography>}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Check color="secondary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant='body1'>Transparencia de nuestro trabajo.</Typography>}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Check color="secondary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant='body1'>Proteger la integridad física de los jugadores.</Typography>}
                                />
                            </ListItem>
                        </List>

                    </Grid>
                </Grid>

            </Container>
        </Box >
    )
}