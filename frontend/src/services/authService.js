import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // L'URL de votre backend Laravel

const register = (nom, email, password, role) => {
    return axios.post(`${API_URL}/register`, {
        nom,
        email,
        password,
        role,
    });
};

const login = (email, password) => {
    return axios.post(`${API_URL}/login`, {
        email,
        password,
    });
};

const authService = {
    register,
    login,
};

export default authService;
