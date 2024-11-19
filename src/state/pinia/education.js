import { defineStore } from "pinia";
import axios from "axios";

export const useEducationstore = defineStore("education", {
  state: () => ({
    apiUrl: import.meta.env.VITE_APP_APIURL,
    educations: [],
    education: null,
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
    openForm(newAction, education) {
      this.modalAction.action = newAction;
      this.education = education;
    },
    async getEducations() {
      try {
        const url = `${this.apiUrl}/v1/educations?page=${this.current}&perPage=${this.perpage}&id=${this.searchQuery}`;
        const res = await axios.get(url);

        const educationsDataList = res.data.data.list;
        this.educations = educationsDataList;
        this.totalData = res.data.data.meta.total;
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
        };
      }
    },

    async geteducationById(id) {
      try {
        const url = `${this.apiUrl}/v1/education/${id}`;
        const res = await axios.get(url);

        const educationData = res.data.data;
        this.education = educationData;
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
        };
      }
    },

    async changePage(newPage) {
      this.current = newPage;
      await this.geteducations();
    },
    async searcheducations(query) {
      this.searchQuery = query;
      this.current = 1;
      await this.geteducations();
    },
    async addeducations(educations) {
      try {
        const res = await axios.post(`${this.apiUrl}/v1/education`, educations);
        localStorage.setItem("educationId", res.data.data.id);
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
        this.geteducations();
      }
    },
    async deleteeducation(id) {
      this.loading = true;
      try {
        await axios.delete(`${this.apiUrl}/v1/educations/${id}`);
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
        this.geteducations();
      }
    },
    async updateeducation(educations, id) {
      try {
        await axios.put(`${this.apiUrl}/v1/education/${id}`, educations);
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
