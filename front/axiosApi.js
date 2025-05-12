import axios from 'axios';

const axiosApi = axios.create({
    baseURL: process.env.VITE_API_URL ||'http://localhost:5000/'
});

export default axiosApi;