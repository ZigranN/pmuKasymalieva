import axios from 'axios';

const axiosApi = axios.create({
    baseURL: 'https://api-pmu-kasymalieva.vercel.app/'
});

export default axiosApi;