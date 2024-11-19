import { defineStore } from "pinia";
import axios from "axios";

export const useRoleStore = defineStore("role", {
  state: () => ({
    apiUrl: import.meta.env.VITE_APP_APIURL,
    roles: [],
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
    async getRoles() {
      try {
        const url = `${this.apiUrl}/v1/roles?page=${this.current}&perPage=${this.perpage}&name=${this.searchQuery}`;
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
  },
});
