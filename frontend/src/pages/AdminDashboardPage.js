import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, IconButton, Select, MenuItem, FormControl, InputLabel, Grid, Card, CardContent, Stack } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import filiereService from '../services/filiereService';
import userService from '../services/userService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';

const AdminDashboardPage = () => {
    const { user, token, loading: authLoading } = useAuth();
    const [filieres, setFilieres] = useState([]);
    const [users, setUsers] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [currentFiliere, setCurrentFiliere] = useState(null);
    const [filiereNom, setFiliereNom] = useState('');

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'administrateur')) {
            setError('Accès non autorisé. Seuls les administrateurs peuvent accéder à cette page.');
            setLoading(false);
            return;
        }
        if (token && user && user.role === 'administrateur') {
            fetchFilieres();
            fetchUsers();
            fetchStatistics();
        }
    }, [user, token, authLoading]);

    const fetchFilieres = async () => {
        setLoading(true);
        try {
            const response = await filiereService.getFilieres(token);
            setFilieres(response.data);
        } catch (err) {
            setError('Erreur lors du chargement des filières.');
            console.error("Erreur fetchFilieres:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getUsers(token);
            setUsers(response.data);
        } catch (err) {
            setError('Erreur lors du chargement des utilisateurs.');
            console.error("Erreur fetchUsers:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const response = await userService.getStatistics(token);
            setStatistics(response.data);
        } catch (err) {
            setError('Erreur lors du chargement des statistiques.');
            console.error("Erreur fetchStatistics:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (filiere = null) => {
        setCurrentFiliere(filiere);
        setFiliereNom(filiere ? filiere.nom : '');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentFiliere(null);
        setFiliereNom('');
        setError('');
    };

    const handleSubmitFiliere = async () => {
        setError('');
        if (!filiereNom.trim()) {
            setError('Le nom de la filière ne peut pas être vide.');
            return;
        }
        try {
            if (currentFiliere) {
                await filiereService.updateFiliere(currentFiliere.id, filiereNom, token);
            } else {
                await filiereService.createFiliere(filiereNom, token);
            }
            fetchFilieres();
            handleCloseDialog();
        } catch (err) {
            setError('Erreur lors de la soumission de la filière.');
            console.error("Erreur handleSubmitFiliere:", err.response ? err.response.data : err);
        }
    };

    const handleDeleteFiliere = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette filière ?')) {
            try {
                await filiereService.deleteFiliere(id, token);
                fetchFilieres();
            } catch (err) {
                setError('Erreur lors de la suppression de la filière.');
                console.error("Erreur handleDeleteFiliere:", err.response ? err.response.data : err);
            }
        }
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        try {
            await userService.updateUserRole(userId, newRole, token);
            fetchUsers(); // Re-fetch users to update the list
        } catch (err) {
            setError('Erreur lors de la mise à jour du rôle de l\'utilisateur.');
            console.error("Erreur handleUpdateUserRole:", err.response ? err.response.data : err);
        }
    };

    if (authLoading || loading) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error && error !== 'Accès non autorisé. Seuls les administrateurs peuvent accéder à cette page.') {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!user || user.role !== 'administrateur') {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="warning">Accès non autorisé. Seuls les administrateurs peuvent accéder à cette page.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{
                bgcolor: 'background.paper',
                p: 4,
                borderRadius: 2,
                boxShadow: 3,
            }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <AdminPanelSettingsIcon color="primary" sx={{ fontSize: '2.5rem' }} />
                    <Typography variant="h4" component="h1" color="primary" sx={{ mb: 0 }}>
                        Tableau de Bord Administrateur
                    </Typography>
                </Stack>

                {/* Section Statistiques */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 4, mb: 2 }}>
                    <BarChartIcon color="primary" />
                    <Typography variant="h5" component="h2" sx={{ mb: 0 }}>
                        Statistiques Générales
                    </Typography>
                </Stack>
                {statistics ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Projets
                                    </Typography>
                                    <Typography variant="h4" component="div">
                                        {statistics.total_projets}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Utilisateurs
                                    </Typography>
                                    <Typography variant="h4" component="div">
                                        {statistics.total_utilisateurs}
                                    </Typography>
                                    <Typography variant="body2">
                                        Étudiants: {statistics.total_etudiants}
                                    </Typography>
                                    <Typography variant="body2">
                                        Enseignants: {statistics.total_enseignants}
                                    </Typography>
                                    <Typography variant="body2">
                                        Admins: {statistics.total_admins}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Note Moyenne Projets
                                    </Typography>
                                    <Typography variant="h4" component="div">
                                        {statistics.moyenne_notes !== null ? statistics.moyenne_notes : 'N/A'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography variant="body1">Chargement des statistiques...</Typography>
                )}

                {/* Section Gestion des Filières */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 4, mb: 2 }}>
                    <CategoryIcon color="primary" />
                    <Typography variant="h5" component="h2" sx={{ mb: 0 }}>
                        Gestion des Filières
                    </Typography>
                </Stack>
                <Button variant="contained" color="success" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
                    Ajouter une Filière
                </Button>

                {filieres.length === 0 && !loading && (
                    <Typography variant="body1">Aucune filière disponible.</Typography>
                )}

                <List>
                    {filieres.map((filiere) => (
                        <ListItem
                            key={filiere.id}
                            secondaryAction={
                                <Box>
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenDialog(filiere)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteFiliere(filiere.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            }
                        >
                            <ListItemText primary={filiere.nom} />
                        </ListItem>
                    ))}
                </List>

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>{currentFiliere ? 'Modifier la Filière' : 'Ajouter une Nouvelle Filière'}</DialogTitle>
                    <DialogContent>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="nomFiliere"
                            label="Nom de la Filière"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={filiereNom}
                            onChange={(e) => setFiliereNom(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Annuler</Button>
                        <Button onClick={handleSubmitFiliere}>{currentFiliere ? 'Modifier' : 'Ajouter'}</Button>
                    </DialogActions>
                </Dialog>

                {/* Section Gestion des Utilisateurs */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 4, mb: 2 }}>
                    <GroupIcon color="primary" />
                    <Typography variant="h5" component="h2" sx={{ mb: 0 }}>
                        Gestion des Utilisateurs
                    </Typography>
                </Stack>
                {users.length === 0 && !loading && (
                    <Typography variant="body1">Aucun utilisateur enregistré.</Typography>
                )}
                <List>
                    {users.map((u) => (
                        <ListItem
                            key={u.id}
                            secondaryAction={
                                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel id={`role-select-label-${u.id}`}>Rôle</InputLabel>
                                    <Select
                                        labelId={`role-select-label-${u.id}`}
                                        id={`role-select-${u.id}`}
                                        value={u.role}
                                        onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                                        label="Rôle"
                                    >
                                        <MenuItem value="etudiant">Étudiant</MenuItem>
                                        <MenuItem value="enseignant">Enseignant</MenuItem>
                                        <MenuItem value="administrateur">Administrateur</MenuItem>
                                    </Select>
                                </FormControl>
                            }
                        >
                            <ListItemText primary={`${u.nom} (${u.email})`} secondary={`Rôle actuel: ${u.role}`} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
};

export default AdminDashboardPage;
