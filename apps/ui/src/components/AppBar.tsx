import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@mui/system';
import { KeyboardArrowDown } from '@mui/icons-material';

export const Nav = () => {

    const theme = useTheme()

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" elevation={0}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <img src="/main-brand.svg" style={{
                            width: '100px'
                        }} alt='brand-futbolyamigos' />
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' }
                            }}
                        >
                            <Link href='/' passHref>
                                <MenuItem onClick={handleCloseNavMenu} sx={{ color: 'text.secondary' }}>
                                    <Typography>Inicio</Typography>
                                </MenuItem>
                            </Link>
                            <Link href='/tablas' passHref>
                                <MenuItem onClick={handleCloseNavMenu} sx={{ color: 'text.secondary' }}>
                                    <Typography>Tablas</Typography>
                                </MenuItem>
                            </Link>
                            <Link href='/tablascompuestas' passHref>
                                <MenuItem onClick={handleCloseNavMenu} sx={{ color: 'text.secondary' }}>
                                    <Typography>Tablas Acumuladas</Typography>
                                </MenuItem>
                            </Link>
                            <Link href='/fixture' passHref>
                                <MenuItem onClick={handleCloseNavMenu} sx={{ color: 'text.secondary' }}>
                                    <Typography>Fixture</Typography>
                                </MenuItem>
                            </Link>
                            <Link href='/nosotros' passHref>
                                <MenuItem onClick={handleCloseNavMenu} sx={{ color: 'text.secondary' }}>
                                    <Typography>Nosotros</Typography>
                                </MenuItem>
                            </Link>
                            <Link href='/contacto' passHref>
                                <MenuItem onClick={handleCloseNavMenu} sx={{ color: 'text.secondary' }}>
                                    <Typography>Contacto</Typography>
                                </MenuItem>
                            </Link>
                        </Menu>
                        <Box sx={{ flexGrow: 1 }} >
                            <img src="/main-brand.svg" style={{
                                width: '100px'
                            }} alt='brand-futbolyamigos' />
                        </Box>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} flexDirection="row" justifyContent='right'>
                        <Link href='/' passHref>
                            <Button
                                sx={{ my: 2, mx: 1, color: 'text.primary' }}
                            >
                                Inicio
                            </Button>
                        </Link>

                        <Button
                            id="basic-button"
                            sx={{ my: 2, mx: 1, color: 'text.primary' }}
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            endIcon={<KeyboardArrowDown />}
                        >
                            Ver
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                            PaperProps={{ style: { backgroundColor: theme.palette.text.secondary } }}
                        >
                            <Link href='/tablas' passHref>
                                <MenuItem onClick={handleClose}>Tablas</MenuItem>
                            </Link>
                            <Link href='/tablascompuestas' passHref>
                                <MenuItem onClick={handleClose}>Tablas Acumuladas</MenuItem>
                            </Link>
                            <Link href='/fixture' passHref>
                                <MenuItem onClick={handleClose}>Fixture</MenuItem>
                            </Link>
                        </Menu>

                        <Link href='/nosotros' passHref>
                            <Button
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, mx: 1, color: 'text.primary' }}
                            >
                                Nosotros
                            </Button>
                        </Link>
                        <Link href='/contacto' passHref>
                            <Button
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, mx: 1, color: 'text.primary' }}
                            >
                                Contacto
                            </Button>
                        </Link>
                    </Box>

                </Toolbar>
            </Container>
        </AppBar >
    );
};