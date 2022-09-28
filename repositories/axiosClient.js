import axios from 'axios';

const $axios = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: { 
    Accept: 'application/json',
  },
});

export default $axios;