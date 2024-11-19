// src/stores/authStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    apiUrl: import.meta.env.VITE_APP_APIURL,
    userLogin: {},
    csrfToken: '',
    bearerToken: '',
    response: {
      status: null,
      message: null,
      error: []
    },
  }),
  actions: {
    async login(credential) {
      try {
        const res = await axios.post(`${this.apiUrl}/v1/auth/login`, credential);
        this.response = {
          status: res.status,
          message: res.data.message
        };
        this.saveToken(res.data.data.access_token)
        this.saveUser(res.data.data.user)
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
          error: error.response.data.errors,
        };
      }
    },
    async logout() {
      await this.removeToken();
      this.userLogin = {};
    },
    async saveUserLogin() {
      try {
        const response = await axios.get('/v1/auth/profile');
        this.userLogin = response.data.data;
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      }
    },
    async saveToken(token) {
      localStorage.setItem('token', token);
    },
    async removeToken() {
      localStorage.removeItem('token');
    },
    getToken() {
      return localStorage.getItem('token') || '';
    },
    async saveUser(user) {
      localStorage.setItem('user', JSON.stringify(user));
    },
    async removeUser() {
      localStorage.removeItem('user');
    },
    getUser() {
      return JSON.parse(localStorage.getItem('user') || '');
    }
  }
});
