import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { TextField, Button, Container, Typography, Box, Select, MenuItem, InputLabel, FormControl, CircularProgress, Alert, Stack } from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

const RegisterPage = () => {
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('etudiant');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [formSubmitting, setFormSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitting(true);
        setError('');
        try {
            await authService.register(nom, email, password, role);
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.response && err.response.data && err.response.data.errors) {
                const errors = err.response.data.errors;
                const firstError = Object.values(errors)[0][0];
                setError(firstError);
            } else {
                setError('Erreur lors de l\'inscription. Veuillez réessayer.');
            }
        } finally {
            setFormSubmitting(false);
        }
    };

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
                    <PersonAddOutlinedIcon color="primary" />
                    <Typography component="h1" variant="h5" color="primary">
                        Inscription
                    </Typography>
                </Stack>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="nom"
                        label="Nom complet"
                        name="nom"
                        autoComplete="name"
                        autoFocus
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Adresse Email"
                        name="email"
                        autoComplete="email"
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
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="role-label">Je suis...</InputLabel>
                        <Select
                            labelId="role-label"
                            id="role"
                            value={role}
                            label="Je suis..."
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="etudiant">Étudiant</MenuItem>
                            <MenuItem value="enseignant">Enseignant</MenuItem>
                        </Select>
                    </FormControl>
                    {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={formSubmitting}
                    >
                        {formSubmitting ? <CircularProgress size={24} color="inherit" /> : 'S\'inscrire'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterPage;
