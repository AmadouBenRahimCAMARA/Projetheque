import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import logo from '../assets/images/logo1.png'; // Import the logo

const NavBar = () => {
    const { isAuthenticated, user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        handleClose();
    };

    const handleNavigation = (path) => {
        navigate(path);
        handleClose();
    };

    if (loading) {
        return (
            <AppBar position="fixed">
                <Toolbar>
                    <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} /> {/* Logo for loading state */}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Projethèque
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    }

    return (
        <AppBar position="fixed">
            <Toolbar>
                <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} /> {/* Logo */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                        Projethèque
                    </Link>
                </Typography>
                {isMobile ? (
                    <Box>
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleMenu}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleClose}
                        >
                            {isAuthenticated && (
                                <div>
                                    <MenuItem onClick={() => handleNavigation('/projets')}>Projets</MenuItem>
                                    <MenuItem onClick={() => handleNavigation('/ressources')}>Ressources</MenuItem>
                                </div>
                            )}
                            {isAuthenticated && user && user.role === 'etudiant' && (
                                <MenuItem onClick={() => handleNavigation('/projets/create')}>Soumettre Projet</MenuItem>
                            )}
                            {isAuthenticated && user && user.role === 'administrateur' && (
                                <MenuItem onClick={() => handleNavigation('/admin')}>Admin</MenuItem>
                            )}
                            {isAuthenticated ? (
                                <MenuItem onClick={handleLogout} sx={{ bgcolor: 'error.main', color: 'white' }}>Déconnexion</MenuItem>
                            ) : (
                                <Box>
                                    <MenuItem onClick={() => handleNavigation('/login')}>Connexion</MenuItem>
                                    <MenuItem onClick={() => handleNavigation('/register')}>Inscription</MenuItem>
                                </Box>
                            )}
                        </Menu>
                    </Box>
                ) : (
                    <Box>
                        {isAuthenticated && (
                            <>
                                <Button color="inherit" component={Link} to="/projets">
                                    Projets
                                </Button>
                                <Button color="inherit" component={Link} to="/ressources">
                                    Ressources
                                </Button>
                            </>
                        )}
                        {isAuthenticated && user && user.role === 'etudiant' && (
                            <Button color="inherit" component={Link} to="/projets/create">
                                Soumettre Projet
                            </Button>
                        )}
                        {isAuthenticated && user && user.role === 'administrateur' && (
                            <Button color="inherit" component={Link} to="/admin">
                                Admin
                            </Button>
                        )}
                        {isAuthenticated ? (
                            <>
                                <Typography color="inherit" sx={{ display: 'inline-block', mr: 1 }}>
                                    Bonjour, {user.nom} ({user.role})
                                </Typography>
                                <Button color="error" variant="contained" onClick={handleLogout}>
                                    Déconnexion
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/login">
                                    Connexion
                                </Button>
                                <Button color="inherit" component={Link} to="/register">
                                    Inscription
                                </Button>
                            </>
                        )}
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
