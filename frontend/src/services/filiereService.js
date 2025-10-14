import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getFilieres = (token) => {
    return axios.get(`${API_URL}/filieres`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const createFiliere = (nom, token) => {
    return axios.post(`${API_URL}/filieres`, { nom }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const updateFiliere = (id, nom, token) => {
    return axios.put(`${API_URL}/filieres/${id}`, { nom }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const deleteFiliere = (id, token) => {
    return axios.delete(`${API_URL}/filieres/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const filiereService = {
    getFilieres,
    createFiliere,
    updateFiliere,
    deleteFiliere,
};

export default filiereService;
