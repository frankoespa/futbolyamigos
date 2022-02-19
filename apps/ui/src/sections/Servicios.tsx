import { Box, Container, Grid, List, ListItem, ListItemIcon, ListItemText, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DirectionsCar, Wc } from "@mui/icons-material";
import { SilverwareForkKnife, SoccerField, TableFurniture } from 'mdi-material-ui'

export const Servicios = () => {
    const theme = useTheme();
    const matchMd = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box bgcolor='secondary.main' py={15}>
            <Container maxWidth="xl">
                <Grid container spacing={2} direction={matchMd ? 'column-reverse' : 'row'}>
                    <Grid item xs={12} md={6}>

                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <SoccerField color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant='body1' color='text.secondary'>Canchas en condiciones e iluminadas.</Typography>}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <TableFurniture color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant='body1' color='text.secondary'>Parrilleros.</Typography>}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <SilverwareForkKnife color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant='body1' color='text.secondary'>Servicio de buffet.</Typography>}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Wc color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant='body1' color='text.secondary'>Baños y vestuarios.</Typography>}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <DirectionsCar color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant='body1' color='text.secondary'>Estacionamiento.</Typography>}
                                />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='h3' sx={{ fontWeight: 800, color: 'text.secondary' }}>Servicios</Typography>
                        <Typography variant='body1' sx={{ color: 'text.secondary' }}>Disponemos de los mejores servicios
                            para nuestros jugadores.</Typography>

                    </Grid>
                </Grid>

            </Container>
        </Box>
    )
}