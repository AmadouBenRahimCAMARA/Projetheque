import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getUsers = (token) => {
    return axios.get(`${API_URL}/admin/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const updateUserRole = (id, role, token) => {
    return axios.put(`${API_URL}/admin/users/${id}/role`, { role }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const getStatistics = (token) => {
    return axios.get(`${API_URL}/admin/statistics`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const userService = {
    getUsers,
    updateUserRole,
    getStatistics,
};

export default userService;
