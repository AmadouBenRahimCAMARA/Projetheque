import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProjetListPage from './pages/ProjetListPage';
import ProjetDetailPage from './pages/ProjetDetailPage';
import ProjetFormPage from './pages/ProjetFormPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import RessourceListPage from './pages/RessourceListPage';
import RessourceFormPage from './pages/RessourceFormPage';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import NavBar from './components/NavBar';
import theme from './theme/theme';

function App() {
    return (
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthProvider>
                    <NavBar />
                    <Box component="main" sx={{ mt: 8 }}> {/* mt is theme.spacing(8) = 64px */}
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            {/* Ajoutez d'autres routes ici */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/projets" element={<ProjetListPage />} />
                            <Route path="/projets/:id" element={<ProjetDetailPage />} />
                            <Route path="/projets/create" element={<ProjetFormPage />} />
                            <Route path="/projets/:id/edit" element={<ProjetFormPage />} />
                            <Route path="/ressources" element={<RessourceListPage />} />
                            <Route path="/ressources/create" element={<RessourceFormPage />} />
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        </Routes>
                    </Box>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;