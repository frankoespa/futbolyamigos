import { Box, Container, Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { Check } from "@mui/icons-material"

export const About = () => {
    const valores = [
        'Orientación hacia el servicio.',
        'Responsabilidad.',
        'Compromiso.',
        'Transparencia de nuestro trabajo.',
        'Protección de la integridad física de los jugadores.',
        'Competencia sana y deportiva.',
        'Comunicación entre todas las partes.',
        'Respeto.'
    ]
    return (
        <Box bgcolor='text.secondary' py={20}>
            <Container >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant='h3' sx={{ fontWeight: 800 }} gutterBottom align="center">Nosotros</Typography>
                        <Typography variant='body1' paragraph align="center">Somos un equipo con mucha experiencia y ganas de satisfacer las necesidades del momento que, para muchos, es el momento más lindo de la semana, ese dia que te juntas con tus amigos a divertirte y a sacar ese jugador de fútbol que todos tenemos y llevamos bien adentro del corazón.</Typography>
                        <Typography variant='body1' paragraph align="center">Ese abrazo con tu equipo que más que equipo es ese grupo de amigos que está siempre. Por eso, desde este año nos unimos a ese abrazo en nuestros comienzos, ni atrás, ni adelante, ni sobre ustedes, al costado acompañandolos cada fin de semana que se grite gol.</Typography>
                        <Typography variant='body1' paragraph align="center">Queremos desarrollarnos y establecernos como un gran torneo donde vuelvan a divertirse, destacándonos por nuestros valores, también, volver a priorizar la integración, comunidad, y buena convivencia entre los grupos humanos, sobre todo priorizar y mantener una constante mejora de las relaciones.
                        </Typography>
                        <Typography variant='body1' paragraph align="center">No vamos a dejar de mencionar que el torneo Futbol&Amigos nos abre la puerta, de la que para muchos, es su casa “El Torreon” con todas sus prestaciones y espacios donde vas a poder venir a disfrutar con amigos y familia de amplios espacios verdes y espacios sociales, haciendo de los sabados un dia esperado por todos.</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='h3' sx={{ fontWeight: 800 }} gutterBottom align="center">Nuestros <Typography component='span' color='secondary.main' variant='h3' sx={{ fontWeight: 800 }}>Valores</Typography></Typography>

                        <List>
                            {valores.map((v, i) => <ListItem key={i}>
                                <ListItemIcon>
                                    <Check color="secondary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant='body1'>{v}</Typography>}
                                />
                            </ListItem>)}
                        </List>

                    </Grid>
                </Grid>

            </Container>
        </Box >
    )
}