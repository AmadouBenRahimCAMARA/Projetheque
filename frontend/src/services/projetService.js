import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getProjets = (token, params = {}) => {
    return axios.get(`${API_URL}/projets`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: params,
    });
};

const getProjet = (id, token) => {
    return axios.get(`${API_URL}/projets/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const createProjet = (data, token) => {
    return axios.post(`${API_URL}/projets`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};

const updateProjet = (id, data, token) => {
    return axios.post(`${API_URL}/projets/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};

const deleteProjet = (id, token) => {
    return axios.delete(`${API_URL}/projets/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const projetService = {
    getProjets,
    getProjet,
    createProjet,
    updateProjet,
    deleteProjet,
};

export default projetService;
