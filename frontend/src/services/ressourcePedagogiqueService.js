import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getRessources = (token, params = {}) => {
    return axios.get(`${API_URL}/ressources-pedagogiques`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: params,
    });
};

const createRessource = (data, token) => {
    return axios.post(`${API_URL}/ressources-pedagogiques`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};

const deleteRessource = (id, token) => {
    return axios.delete(`${API_URL}/ressources-pedagogiques/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const downloadRessource = (id, token) => {
    return axios.get(`${API_URL}/ressources-pedagogiques/${id}/download`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // Important pour le téléchargement de fichiers
    });
};

const ressourcePedagogiqueService = {
    getRessources,
    createRessource,
    deleteRessource,
    downloadRessource,
};

export default ressourcePedagogiqueService;
