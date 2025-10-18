import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ressourcePedagogiqueService from '../services/ressourcePedagogiqueService';
import filiereService from '../services/filiereService';
import { useAuth } from '../contexts/AuthContext';
import {
    Container, Typography, Box, CircularProgress, Alert, Grid, Card, CardContent,
    CardActions, Button, FormControl, InputLabel, Select, MenuItem, Stack,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

const RessourceListPage = () => {
    const { user, isAuthenticated, token } = useAuth();
    const [ressources, setRessources] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [filiereFilter, setFiliereFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for delete confirmation dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [ressourceIdToDelete, setRessourceIdToDelete] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchInitialData = async () => {
                try {
                    const filieresResponse = await filiereService.getFilieres(token);
                    setFilieres(filieresResponse.data);
                } catch (err) {
                    setError('Erreur lors du chargement des filières.');
                }
            };
            fetchInitialData();
        }
    }, [isAuthenticated, token]);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchRessources = async () => {
                setLoading(true);
                setError('');
                try {
                    const params = {};
                    if (filiereFilter) params.filiere = filiereFilter;
                    if (typeFilter) params.type = typeFilter;

                    const response = await ressourcePedagogiqueService.getRessources(token, params);
                    setRessources(response.data);
                } catch (err) {
                    setError('Erreur lors du chargement des ressources.');
                } finally {
                    setLoading(false);
                }
            };
            fetchRessources();
        }
    }, [isAuthenticated, token, filiereFilter, typeFilter]);

    const handleDownload = (ressource) => {
        ressourcePedagogiqueService.downloadRessource(ressource.id, token)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                const fileName = ressource.chemin_fichier.split('/').pop();
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch(error => console.error('Erreur de téléchargement', error));
    };

    // Opens the confirmation dialog
    const handleDeleteClick = (id) => {
        setRessourceIdToDelete(id);
        setOpenDeleteDialog(true);
    };

    // Closes the confirmation dialog
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setRessourceIdToDelete(null);
    };

    // Handles the actual deletion after confirmation
    const handleConfirmDelete = () => {
        if (ressourceIdToDelete) {
            ressourcePedagogiqueService.deleteRessource(ressourceIdToDelete, token)
                .then(() => {
                    setRessources(ressources.filter(r => r.id !== ressourceIdToDelete));
                    handleCloseDeleteDialog();
                })
                .catch(error => {
                    setError('Erreur lors de la suppression de la ressource.');
                    console.error('Erreur de suppression', error);
                    handleCloseDeleteDialog();
                });
        }
    };

    if (loading) {
        return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Container>;
    }

    if (error) {
        return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                <SchoolIcon sx={{ fontSize: '2.5rem', color: 'white' }} />
                <Typography variant="h4" component="h1" gutterBottom color="white" sx={{ mb: 0 }}>
                    Ressources Pédagogiques
                </Typography>
            </Stack>

            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 1, mb: 4 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <FormControl sx={{ minWidth: 180 }}>
                            <InputLabel>Filière</InputLabel>
                            <Select value={filiereFilter} label="Filière" onChange={e => setFiliereFilter(e.target.value)}>
                                <MenuItem value="">Toutes les filières</MenuItem>
                                {filieres.map(f => <MenuItem key={f.id} value={f.id}>{f.nom}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 180 }}>
                            <InputLabel>Type</InputLabel>
                            <Select value={typeFilter} label="Type" onChange={e => setTypeFilter(e.target.value)}>
                                <MenuItem value="">Tous les types</MenuItem>
                                <MenuItem value="cours">Cours</MenuItem>
                                <MenuItem value="exercice">Exercice</MenuItem>
                                <MenuItem value="sujet_examen">Sujet d'examen</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                    <Button component={Link} to="/ressources/create" variant="contained" color="primary">
                        Ajouter une ressource
                    </Button>
                </Stack>
            </Box>

            <Grid container spacing={3}>
                {ressources.length > 0 ? (
                    ressources.map(ressource => (
                        <Grid item key={ressource.id} xs={12} sm={6} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" component="div" color="primary">{ressource.titre}</Typography>
                                    <Typography variant="body2" color="text.secondary">{ressource.description.substring(0, 100)}...</Typography>
                                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>Type: {ressource.type}</Typography>
                                    <Typography variant="caption" display="block">Filière: {ressource.filiere.nom}</Typography>
                                    <Typography variant="caption" display="block">Auteur: {ressource.utilisateur.nom}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button variant="contained" color="success" size="small" onClick={() => handleDownload(ressource)}>Télécharger</Button>
                                    {(user && (user.id === ressource.utilisateur_id || user.role === 'administrateur')) && (
                                        <Button variant="contained" size="small" color="error" onClick={() => handleDeleteClick(ressource.id)}>Supprimer</Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" align="center" sx={{ mt: 4 }} color="white">
                            Aucune ressource disponible pour le moment.
                        </Typography>
                    </Grid>
                )}
            </Grid>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmer la suppression"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr de vouloir supprimer cette ressource ? Cette action est irréversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Annuler</Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default RessourceListPage;