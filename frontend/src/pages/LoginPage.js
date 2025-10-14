import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { TextField, Button, Container, Typography, Box, CircularProgress, Alert, Stack } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [formSubmitting, setFormSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitting(true);
        setError('');
        try {
            const response = await authService.login(email, password);
            login(response.data.user, response.data.access_token);
            navigate('/');
        } catch (err) {
            setError('Email ou mot de passe incorrect.');
        } finally {
            setFormSubmitting(false);
        }
    };

    if (authLoading) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="xs" sx={{ mt: 4 }}>
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'background.paper',
                p: 4,
                borderRadius: 2,
                boxShadow: 3,
            }}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                    <LockOutlinedIcon color="primary" />
                    <Typography component="h1" variant="h5" color="primary">
                        Connexion
                    </Typography>
                </Stack>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Adresse Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Mot de passe"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={formSubmitting}
                    >
                        {formSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;
