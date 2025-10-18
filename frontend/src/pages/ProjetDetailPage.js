import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import projetService from '../services/projetService';
import noteService from '../services/noteService';
import { Container, Typography, Box, CircularProgress, Alert, Card, CardContent, List, ListItem, ListItemText, Divider, Chip, Link as MuiLink, Stack, TextField, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { useState, useEffect } from 'react';

const ProjetDetailPage = () => {
    const { id } = useParams();
    const { user, token } = useAuth();
    const [projet, setProjet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [note, setNote] = useState('');
    const [commentaireNote, setCommentaireNote] = useState('');
    const [noteLoading, setNoteLoading] = useState(false);
    const [noteError, setNoteError] = useState('');

    const fetchProjet = async () => {
        try {
            const response = await projetService.getProjet(id, token);
            setProjet(response.data);
        } catch (err) {
            setError('Erreur lors du chargement du projet.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProjet();
        }
    }, [id, token]);

    const handleNoteSubmit = async (e) => {
        e.preventDefault();
        setNoteLoading(true);
        setNoteError('');
        try {
            await noteService.createNote(id, { note, commentaire: commentaireNote }, token);
            setNote('');
            setCommentaireNote('');
            fetchProjet(); // Re-fetch project to show the new note
        } catch (err) {
            setNoteError(err.response?.data?.message || 'Une erreur est survenue lors de l\'ajout de la note.');
        } finally {
            setNoteLoading(false);
        }
    };

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

    if (!projet) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="info">Projet non trouvé.</Alert>
            </Container>
        );
    }

    const getFileIcon = (type) => {
        switch (type) {
            case 'rapport': return <DescriptionIcon />;
            case 'code_source': return <CodeIcon />;
            case 'presentation': return <SlideshowIcon />;
            default: return <DescriptionIcon />;
        }
    };

    const hasAlreadyNoted = projet.notes.length > 0;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Card elevation={3}>
                <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <DescriptionIcon color="primary" sx={{ fontSize: '2.5rem' }} />
                        <Typography variant="h4" component="h1" color="primary" sx={{ mb: 0 }}>
                            {projet.titre}
                        </Typography>
                    </Stack>
                    <Box sx={{ mb: 2 }}>
                        <Chip label={projet.filiere ? projet.filiere.nom : 'Filière inconnue'} color="primary" sx={{ mr: 1 }} />
                        <Chip label={projet.annee_academique} color="secondary" />
                    </Box>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Par {projet.utilisateur.nom}
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                        {projet.description}
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>
                        Ressources
                    </Typography>
                    <List dense>
                        {projet.lien_github && (
                            <ListItem>
                                <MuiLink href={projet.lien_github} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                                    <GitHubIcon sx={{ mr: 1 }} />
                                    <Typography color="primary">Lien GitHub</Typography>
                                </MuiLink>
                            </ListItem>
                        )}
                        {projet.fichiers && Object.keys(projet.fichiers).length > 0 && (
                            Object.entries(projet.fichiers).map(([key, value]) => (
                                <ListItem key={key}>
                                    <MuiLink href={`http://localhost:8000/api/projets/${projet.id}/download/${key}`} sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                                        {getFileIcon(key)} 
                                        <Typography color="primary" sx={{ ml: 1 }}>Télécharger {key.replace('_', ' ')}</Typography>
                                    </MuiLink>
                                </ListItem>
                            ))
                        )}
                        {(!projet.lien_github && (!projet.fichiers || Object.keys(projet.fichiers).length === 0)) && (
                            <Typography variant="body2" color="text.secondary">Aucune ressource disponible.</Typography>
                        )}
                    </List>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>
                        Notes
                    </Typography>
                    {projet.notes && projet.notes.length > 0 ? (
                        <List>
                            {projet.notes.map((note) => (
                                <ListItem key={note.id} sx={{ bgcolor: 'background.default', mb: 1, borderRadius: 2 }}>
                                    <ListItemText
                                        primary={<Typography variant="subtitle2">Note: {note.note}/20 par {note.enseignant.nom}</Typography>}
                                        secondary={<Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{note.commentaire}</Typography>}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="text.secondary">Aucune note pour ce projet.</Typography>
                    )}

                    {user && user.role === 'enseignant' && !hasAlreadyNoted && (
                        <Box component="form" onSubmit={handleNoteSubmit} sx={{ mt: 2 }}>
                            <Typography variant="h6">Ajouter une note</Typography>
                            <TextField
                                label="Note /20"
                                type="number"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                fullWidth
                                required
                                margin="normal"
                                inputProps={{ min: 0, max: 20, step: "0.5" }}
                            />
                            <TextField
                                label="Commentaire (optionnel)"
                                value={commentaireNote}
                                onChange={(e) => setCommentaireNote(e.target.value)}
                                multiline
                                rows={3}
                                fullWidth
                                margin="normal"
                            />
                            {noteError && <Alert severity="error" sx={{ mb: 2 }}>{noteError}</Alert>}
                            <Button type="submit" variant="contained" disabled={noteLoading}>
                                {noteLoading ? <CircularProgress size={24} /> : 'Soumettre la note'}
                            </Button>
                        </Box>
                    )}

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>
                        Commentaires
                    </Typography>
                    {projet.commentaires && projet.commentaires.length > 0 ? (
                        <List>
                            {projet.commentaires.map((commentaire) => (
                                <ListItem key={commentaire.id} sx={{ bgcolor: 'background.default', mb: 1, borderRadius: 2 }}>
                                    <ListItemText
                                        primary={<Typography variant="subtitle2">{commentaire.utilisateur.nom} a dit:</Typography>}
                                        secondary={<Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{commentaire.contenu}</Typography>}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="text.secondary">Aucun commentaire pour ce projet.</Typography>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default ProjetDetailPage;
