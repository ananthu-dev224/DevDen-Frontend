import axios from 'axios'
import { baseUrl } from '../constants/url';

const instance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
})


export default instance;