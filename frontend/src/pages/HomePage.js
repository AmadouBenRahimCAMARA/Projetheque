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

                color: theme.palette.text.primary, // Dark text for contrast with light gradient
                py: 8, // Padding top/bottom
            }}
        >
            <Container maxWidth="md" sx={{
                background: `linear-gradient(45deg, #1976d2 0%, #FFFFFF 50%, #FF0000 100%)`,
                color: theme.palette.text.primary,
                p: 4, // Add padding around the content
                borderRadius: 2, // Optional: add some rounded corners
                boxShadow: 3, // Optional: add some shadow
            }}>
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
                        <Button variant="contained" color="primary" onClick={() => navigate('/register')} size="large"> 
                            S'inscrire
                        </Button>
                    </Stack>
                )}
            </Container>
        </Box>
    );
};

export default HomePage;
