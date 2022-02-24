import { Grid, Link, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import dynamic from 'next/dynamic'
import { LocationOn, WhatsApp, Email } from '@mui/icons-material'

export const Contact = () => {

    const MapWithNoSSR = dynamic(() => import("../components/Map"), {
        ssr: false
    });
    return (

        <Grid container >
            <Grid item xs={12} md={6} sx={{ backgroundColor: 'primary.main' }} py={15} display='flex' justifyContent='center'>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <LocationOn color="secondary" />
                        </ListItemIcon>
                        <ListItemText
                            primary={<Typography variant='h6' fontWeight={700}>Dirección</Typography>}
                            secondary={<Typography variant='body1' sx={{ color: t => t.palette.grey[500] }}>José María Rosa 167 (Rosario - Santa Fe)</Typography>}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <WhatsApp color="secondary" />
                        </ListItemIcon>
                        <ListItemText
                            primary={<Typography variant='h6' fontWeight={700}>Teléfono</Typography>}
                            secondary={<Typography variant='body1' sx={{ color: t => t.palette.grey[500] }}><Link href='https://api.whatsapp.com/send?phone=543417205422&text=Me%20quiero%20inscribir' target='_blank' rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>341-7205422</Link></Typography>}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Email color="secondary" />
                        </ListItemIcon>
                        <ListItemText
                            primary={<Typography variant='h6' fontWeight={700}>Correo</Typography>}
                            secondary={<Typography variant='body1' sx={{ color: t => t.palette.grey[500] }}>futbolyamigos@gmail.com</Typography>}
                        />
                    </ListItem>
                </List>
            </Grid>
            <Grid item xs={12} md={6} sx={{ minHeight: { xs: 300, md: 500 } }}>
                <MapWithNoSSR />
            </Grid>
        </Grid >

    )
}