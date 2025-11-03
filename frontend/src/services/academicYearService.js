import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const academicYearService = {
    getAcademicYears: (token) => {
        return axios.get(`${API_URL}/academic-years`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    createAcademicYear: (year, token) => {
        return axios.post(`${API_URL}/academic-years`, { year }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    updateAcademicYear: (id, year, token) => {
        return axios.put(`${API_URL}/academic-years/${id}`, { year }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    deleteAcademicYear: (id, token) => {
        return axios.delete(`${API_URL}/academic-years/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};

export default academicYearService;
