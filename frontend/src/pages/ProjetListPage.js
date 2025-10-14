import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import projetService from '../services/projetService';
import filiereService from '../services/filiereService'; // Import du service filiere
import { Container, Typography, Box, CircularProgress, Alert, Grid, Card, CardContent, CardActions, Button, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Link } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const ProjetListPage = () => {
    const { token } = useAuth();
    const [projets, setProjets] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [selectedAnnee, setSelectedAnnee] = useState('');
    const [sortByNote, setSortByNote] = useState(''); // New state for sorting
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const anneesAcademiques = ['2023-2024', '2022-2023', '2021-2022', '2020-2021']; // Exemple

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const filieresResponse = await filiereService.getFilieres(token);
                setFilieres(filieresResponse.data);
            } catch (err) {
                console.error("Erreur lors du chargement des filières:", err);
                setError('Erreur lors du chargement des filières.');
            }
        };
        if (token) {
            fetchInitialData();
        }
    }, [token]);

    useEffect(() => {
        const fetchProjets = async () => {
            setLoading(true);
            setError('');
            try {
                const params = {};
                if (selectedFiliere) params.filiere = selectedFiliere;
                if (selectedAnnee) params.annee_academique = selectedAnnee;
                if (sortByNote) params.sort_by_note = sortByNote; // Add sort parameter

                const response = await projetService.getProjets(token, params);
                setProjets(response.data);
            } catch (err) {
                setError('Erreur lors du chargement des projets.');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchProjets();
        }
    }, [token, selectedFiliere, selectedAnnee, sortByNote]); // Add sortByNote to dependencies

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                <ListAltIcon sx={{ fontSize: '2.5rem', color: 'white' }} />
                <Typography variant="h4" component="h1" gutterBottom color="white" sx={{ mb: 0 }}>
                    Liste des Projets
                </Typography>
            </Stack>

            <Box sx={{
                bgcolor: 'background.paper',
                p: 2,
                borderRadius: 2,
                boxShadow: 1,
                mb: 4,
            }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 0 }}>
                    <FormControl fullWidth={isMobile} sx={{ minWidth: 180 }}>
                        <InputLabel id="filiere-select-label">Filière</InputLabel>
                        <Select
                            labelId="filiere-select-label"
                            id="filiere-select"
                            value={selectedFiliere}
                            label="Filière"
                            onChange={(e) => setSelectedFiliere(e.target.value)}
                        >
                            <MenuItem value="">Toutes les filières</MenuItem>
                            {filieres.map((filiere) => (
                                <MenuItem key={filiere.id} value={filiere.id}>
                                    {filiere.nom}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth={isMobile} sx={{ minWidth: 180 }}>
                        <InputLabel id="annee-select-label">Année Académique</InputLabel>
                        <Select
                            labelId="annee-select-label"
                            id="annee-select"
                            value={selectedAnnee}
                            label="Année Académique"
                            onChange={(e) => setSelectedAnnee(e.target.value)}
                        >
                            <MenuItem value="">Toutes les années</MenuItem>
                            {anneesAcademiques.map((annee) => (
                                <MenuItem key={annee} value={annee}>
                                    {annee}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* New Sort by Note Control */}
                    <FormControl fullWidth={isMobile} sx={{ minWidth: 180 }}>
                        <InputLabel id="sort-by-note-label">Trier par Note</InputLabel>
                        <Select
                            labelId="sort-by-note-label"
                            id="sort-by-note"
                            value={sortByNote}
                            label="Trier par Note"
                            onChange={(e) => setSortByNote(e.target.value)}
                        >
                            <MenuItem value="">Aucun tri</MenuItem>
                            <MenuItem value="desc">Meilleure note</MenuItem>
                            <MenuItem value="asc">Moins bonne note</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Box>

            <Grid container spacing={3}>
                {projets.length > 0 ? (
                    projets.map((projet) => (
                        <Grid item key={projet.id} xs={12} sm={6} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {projet.titre}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {projet.description.substring(0, 100)}...
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Année: {projet.annee_academique}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Filière: {projet.filiere ? projet.filiere.nom : 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Auteur: {projet.utilisateur ? projet.utilisateur.nom : 'N/A'}
                                    </Typography>
                                    {projet.notes_avg_note !== null && (
                                        <Typography variant="body2" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>
                                            Note Moyenne: {parseFloat(projet.notes_avg_note).toFixed(2)}/20
                                        </Typography>
                                    )}
                                </CardContent>
                                <CardActions>
                                    <Button size="small" component={Link} to={`/projets/${projet.id}`}>
                                        Voir Détails
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" align="center" sx={{ mt: 4 }} color="white">
                            Aucun projet disponible pour le moment.
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default ProjetListPage;
