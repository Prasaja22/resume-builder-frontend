import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    apiUrl: import.meta.env.VITE_APP_APIURL,
    users: [],
    user: null,
    response: {
      status: null,
      message: null,
      error: [],
    },
    modalAction: {
      action: "",
      modal_title: "",
      modal_button: "",
    },
    totalData: 0,
    current: 1,
    perpage: 5,
    searchQuery: "",
  }),
  actions: {
    openForm(newAction, user) {
      this.modalAction.action = newAction;
      this.user = user;
    },
    async getUsers() {
      try {
        const url = `${this.apiUrl}/v1/users?page=${this.current}&perPage=${this.perpage}&name=${this.searchQuery}`;
        const res = await axios.get(url);

        const usersDataList = res.data.data.list;
        this.users = usersDataList;
        this.totalData = res.data.data.meta.total;
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
        };
      }
    },

    async getUserById(id) {
      try {
        const url = `${this.apiUrl}/v1/users/${id}`;
        const res = await axios.get(url);

        const userData = res.data.data;
        this.user = userData;
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
        };
      }
    },

    async changePage(newPage) {
      this.current = newPage;
      await this.getUsers();
    },
    async searchUsers(query) {
      this.searchQuery = query;
      this.current = 1;
      await this.getUsers();
    },
    async addUsers(users) {
      try {
        const res = await axios.post(`${this.apiUrl}/v1/users`, users);
        this.response = {
          status: res.status,
          message: res.data.message,
        };
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
          error: error.response.data.errors,
        };
      } finally {
        this.getUsers();
      }
    },
    async deleteUser(id) {
      this.loading = true;
      try {
        await axios.delete(`${this.apiUrl}/v1/users/${id}`);
        this.response = {
          status: "200",
        };
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
          error: error.response.data.errors,
        };
      } finally {
        this.getUsers();
      }
    },
    async updateUser(users) {
      try {
        await axios.put(`${this.apiUrl}/v1/users/${users.id}`, users);
        this.response = {
          status: "200",
        };
      } catch (error) {
        this.response = {
          status: error.status,
          message: error.message,
        };
      }
    },
  },
  getters: {
    message(state) {
      return state.modalAction.action;
    },
  },
});
