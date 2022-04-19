import { useRouter } from 'next/router';
import { AccountCircle, EmojiEvents, Shield, Person, SportsSoccer } from '@mui/icons-material';
import { AppBar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { useUser } from '../api/auth/useUser';
import { useApiManager } from '../api/useApiManager';
import { Loading } from './Loading';
import Link from 'next/link';
import { SoccerField } from 'mdi-material-ui'

interface IProps {
    children: JSX.Element | JSX.Element[];
}

const drawerWidth = 240;

function LayoutAdmin (props: IProps) {
    const { children } = props;
    const { pathname, replace } = useRouter();
    const { user, loading } = useUser();
    const { Post } = useApiManager();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = async () => {
        await Post('auth/logout');
        replace('/login');
    }

    if (loading) return <Loading />

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
                color='secondary'
                elevation={0}
            >
                <Toolbar variant='dense'>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                        {pathname.split('/').pop()}
                    </Typography>
                    <Typography variant="body1" noWrap>
                        {user?.Nombre}
                    </Typography>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="primary"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose} sx={{ color: 'text.secondary' }}>Mis Datos</MenuItem>
                        <MenuItem onClick={logout} sx={{ color: 'text.secondary' }}>Cerrar sesión</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar variant='dense'></Toolbar>
                <Divider />
                <List>
                    <Link href='/admin/torneos' passHref>
                        <ListItem button>
                            <ListItemIcon>
                                <EmojiEvents />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant='body1' color='text.secondary'>Torneos</Typography>} />
                        </ListItem>
                    </Link>
                    <Link href='/admin/equipos' passHref>
                        <ListItem button>
                            <ListItemIcon>
                                <Shield />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant='body1' color='text.secondary'>Equipos</Typography>} />
                        </ListItem>
                    </Link>
                    <Link href='/admin/jugadores' passHref>
                        <ListItem button>
                            <ListItemIcon>
                                <Person />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant='body1' color='text.secondary'>Jugadores</Typography>} />
                        </ListItem>
                    </Link>
                    <Link href='/admin/canchas' passHref>
                        <ListItem button>
                            <ListItemIcon>
                                <SoccerField />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant='body1' color='text.secondary'>Canchas</Typography>} />
                        </ListItem>
                    </Link>
                    <Link href='/admin/partidos' passHref>
                        <ListItem button>
                            <ListItemIcon>
                                <SportsSoccer />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant='body1' color='text.secondary'>Partidos</Typography>} />
                        </ListItem>
                    </Link>
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}

export default LayoutAdmin;