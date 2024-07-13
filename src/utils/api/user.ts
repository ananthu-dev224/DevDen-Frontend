import axios from 'axios'
import { baseUrl } from '../../constants/url';
import { store } from '../../redux/store';

const Userinstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
})


Userinstance.interceptors.request.use(
    config => {
        const state = store.getState();
        const token = state.user.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);




export default Userinstance;