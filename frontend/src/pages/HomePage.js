import { Container, Typography, Box, Button, CircularProgress, Stack } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const HomePage = () => {
    const { isAuthenticated, user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 64px)', // Hauteur de la NavBar
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                color: 'white',
                py: 8, // Padding top/bottom
            }}
        >
            <Container maxWidth="md">
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
                    <SchoolIcon sx={{ fontSize: '3rem' }} />
                    <Typography component="h1" variant="h2" gutterBottom sx={{ fontWeight: 700, mb: 0 }}>
                        Bienvenue sur Projethèque
                    </Typography>
                </Stack>
                <Typography variant="h5" component="p" sx={{ mb: 4 }}>
                    Votre bibliothèque numérique pour les projets étudiants en informatique.
                </Typography>
                {isAuthenticated && user ? (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>Bonjour, {user.nom} ({user.role})</Typography>
                        <Button variant="contained" color="secondary" onClick={handleLogout} size="large">
                            Se déconnecter
                        </Button>
                    </Box>
                ) : (
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        <Button variant="contained" color="success" onClick={() => navigate('/login')} size="large">
                            Se connecter
                        </Button>
                        <Button variant="outlined" color="inherit" onClick={() => navigate('/register')} size="large" sx={{ borderColor: 'white', color: 'white' }}> 
                            S'inscrire
                        </Button>
                    </Stack>
                )}
            </Container>
        </Box>
    );
};

export default HomePage;
