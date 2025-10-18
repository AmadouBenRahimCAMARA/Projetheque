import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const createNote = (projetId, data, token) => {
    return axios.post(`${API_URL}/projets/${projetId}/notes`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const noteService = {
    createNote,
};

export default noteService;
