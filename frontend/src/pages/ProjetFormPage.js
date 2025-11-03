import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import projetService from '../services/projetService';
import filiereService from '../services/filiereService';
import academicYearService from '../services/academicYearService'; // Importer le nouveau service
import { TextField, Button, Container, Typography, Box, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem, Grid, InputAdornment, Stack } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';

const ProjetFormPage = () => {
    const { id } = useParams(); // Pour l'édition
    const navigate = useNavigate();
    const { token } = useAuth();

    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [anneeAcademique, setAnneeAcademique] = useState('');
    const [filiereId, setFiliereId] = useState('');
    const [lienGithub, setLienGithub] = useState('');
    const [rapport, setRapport] = useState(null);
    const [codeSource, setCodeSource] = useState(null);
    const [presentation, setPresentation] = useState(null);
    const [filieres, setFilieres] = useState([]);
    const [academicYears, setAcademicYears] = useState([]); // Nouvel état pour les années académiques
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const filieresResponse = await filiereService.getFilieres(token);
                setFilieres(filieresResponse.data);

                const academicYearsResponse = await academicYearService.getAcademicYears(token);
                setAcademicYears(academicYearsResponse.data);


                if (id) {
                    setIsEditing(true);
                    const projetResponse = await projetService.getProjet(id, token);
                    const projet = projetResponse.data;
                    setTitre(projet.titre);
                    setDescription(projet.description);
                    setAnneeAcademique(projet.annee_academique);
                    setFiliereId(projet.filiere_id);
                    setLienGithub(projet.lien_github || '');
                    // Les fichiers existants ne sont pas pré-remplis pour des raisons de sécurité/complexité
                }
            } catch (err) {
                setError('Erreur lors du chargement des données.');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchData();
        }
    }, [id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('description', description);
        formData.append('annee_academique', anneeAcademique);
        formData.append('filiere_id', filiereId);
        if (lienGithub) formData.append('lien_github', lienGithub);
        if (rapport) formData.append('rapport', rapport);
        if (codeSource) formData.append('code_source', codeSource);
        if (presentation) formData.append('presentation', presentation);

        try {
            if (isEditing) {
                // Laravel ne gère pas PUT/PATCH avec multipart/form-data directement pour les fichiers
                // On simule avec POST et _method=PUT
                formData.append('_method', 'PUT');
                await projetService.updateProjet(id, formData, token);
            } else {
                await projetService.createProjet(formData, token);
            }
            navigate('/projets');
        } catch (err) {
            setError('Erreur lors de la soumission du projet.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
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
                    {isEditing ? <EditNoteIcon color="primary" sx={{ fontSize: '2.5rem' }} /> : <AddCircleOutlineIcon color="primary" sx={{ fontSize: '2.5rem' }} />}
                    <Typography component="h1" variant="h5" color="primary" sx={{ mb: 0 }}>
                        {isEditing ? 'Modifier le Projet' : 'Soumettre un Nouveau Projet'}
                    </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                    {isEditing ? 'Mettez à jour les informations de votre projet.' : 'Remplissez le formulaire ci-dessous pour soumettre votre projet académique.'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} encType="multipart/form-data">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Titre du Projet"
                                value={titre}
                                onChange={(e) => setTitre(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Description"
                                multiline
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth margin="normal" required sx={{ minWidth: 180 }}>
                                <InputLabel id="annee-academique-label">Année Académique</InputLabel>
                                <Select
                                    labelId="annee-academique-label"
                                    value={anneeAcademique}
                                    label="Année Académique"
                                    onChange={(e) => setAnneeAcademique(e.target.value)}
                                >
                                    {academicYears.map((annee) => (
                                        <MenuItem key={annee.id} value={annee.year}>
                                            {annee.year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth margin="normal" required sx={{ minWidth: 180 }}>
                                <InputLabel id="filiere-label">Filière</InputLabel>
                                <Select
                                    labelId="filiere-label"
                                    value={filiereId}
                                    label="Filière"
                                    onChange={(e) => setFiliereId(e.target.value)}
                                >
                                    {filieres.map((filiere) => (
                                        <MenuItem key={filiere.id} value={filiere.id}>
                                            {filiere.nom}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Lien GitHub (optionnel)"
                                value={lienGithub}
                                onChange={(e) => setLienGithub(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button variant="outlined" component="label" fullWidth startIcon={<DescriptionIcon />}>
                                {rapport ? rapport.name : 'Rapport PDF (max 10MB)'}
                                <input type="file" hidden accept=".pdf" onChange={(e) => setRapport(e.target.files[0])} />
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button variant="outlined" component="label" fullWidth startIcon={<CodeIcon />}>
                                {codeSource ? codeSource.name : 'Code Source ZIP (max 50MB)'}
                                <input type="file" hidden accept=".zip" onChange={(e) => setCodeSource(e.target.files[0])} />
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="outlined" component="label" fullWidth startIcon={<SlideshowIcon />}>
                                {presentation ? presentation.name : 'Présentation (PDF/PPT, max 20MB)'}
                                <input type="file" hidden accept=".pdf,.ppt,.pptx" onChange={(e) => setPresentation(e.target.files[0])} />
                            </Button>
                        </Grid>
                    </Grid>

                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="success"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {isEditing ? 'Mettre à jour le Projet' : 'Soumettre le Projet'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ProjetFormPage;
