import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ressourcePedagogiqueService from '../services/ressourcePedagogiqueService';
import filiereService from '../services/filiereService';
import { useAuth } from '../contexts/AuthContext';
import {
    Container, Typography, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert
} from '@mui/material';

const RessourceFormPage = () => {
    const { isAuthenticated, token } = useAuth();
    const navigate = useNavigate();
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('cours');
    const [filiereId, setFiliereId] = useState('');
    const [filieres, setFilieres] = useState([]);
    const [fichier, setFichier] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            filiereService.getFilieres(token)
                .then(response => {
                    setFilieres(response.data);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des filières', error);
                    setError('Impossible de charger les filières.');
                });
        }
    }, [isAuthenticated, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!fichier) {
            setError('Veuillez sélectionner un fichier.');
            return;
        }
        setLoading(true);

        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('description', description);
        formData.append('type', type);
        formData.append('filiere_id', filiereId);
        formData.append('fichier', fichier);

        try {
            await ressourcePedagogiqueService.createRessource(formData, token);
            navigate('/ressources');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                const errorMessages = Object.values(err.response.data.errors).flat().join(' ');
                setError(`Erreur de validation: ${errorMessages}`);
            } else {
                setError('Erreur lors de la création de la ressource. Veuillez vérifier les champs.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    mt: 4,
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h5" component="h1" gutterBottom>
                    Ajouter une Ressource Pédagogique
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Titre"
                        value={titre}
                        onChange={e => setTitre(e.target.value)}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Type</InputLabel>
                        <Select value={type} label="Type" onChange={e => setType(e.target.value)}>
                            <MenuItem value="cours">Cours</MenuItem>
                            <MenuItem value="exercice">Exercice</MenuItem>
                            <MenuItem value="sujet_examen">Sujet d'examen</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Filière</InputLabel>
                        <Select value={filiereId} label="Filière" onChange={e => setFiliereId(e.target.value)}>
                            {filieres.map(filiere => (
                                <MenuItem key={filiere.id} value={filiere.id}>
                                    {filiere.nom}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{ mt: 2, mb: 2 }}
                    >
                        Choisir un fichier PDF
                        <input
                            type="file"
                            hidden
                            onChange={e => setFichier(e.target.files[0])}
                            accept=".pdf"
                        />
                    </Button>
                    {fichier && <Typography variant="body2">Fichier sélectionné: {fichier.name}</Typography>}

                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="success"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Ajouter la Ressource'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default RessourceFormPage;