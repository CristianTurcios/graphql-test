import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.API_URL,
    headers: { 'X-Auth-Token': process.env.API_TOKEN }
});

export default instance;