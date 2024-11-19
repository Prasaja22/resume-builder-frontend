import { defineStore } from "pinia";
import axios from "axios";

export const useExperiencestore = defineStore("experience", {
  state: () => ({
    apiUrl: import.meta.env.VITE_APP_APIURL,
    experiences: [],
    experience: null,
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
    openForm(newAction, experience) {
      this.modalAction.action = newAction;
      this.experience = experience;
    },
    async getExperiences() {
      try {
        const url = `${this.apiUrl}/v1/experiences?page=${this.current}&perPage=${this.perpage}&id=${this.searchQuery}`;
        const res = await axios.get(url);

        const ExperiencesDataList = res.data.data.list;
        this.experiences = ExperiencesDataList;
        this.totalData = res.data.data.meta.total;
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
        };
      }
    },

    async getexperienceById(id) {
      try {
        const url = `${this.apiUrl}/v1/experience/${id}`;
        const res = await axios.get(url);

        const experienceData = res.data.data;
        this.experience = experienceData;
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
        };
      }
    },

    async changePage(newPage) {
      this.current = newPage;
      await this.getExperiences();
    },
    async searchExperiences(query) {
      this.searchQuery = query;
      this.current = 1;
      await this.getExperiences();
    },
    async addExperiences(experiences) {
      try {
        const res = await axios.post(
          `${this.apiUrl}/v1/experience`,
          experiences
        );
        localStorage.setItem("experienceId", res.data.data.id);
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
        this.getExperiences();
      }
    },
    async deleteexperience(id) {
      this.loading = true;
      try {
        await axios.delete(`${this.apiUrl}/v1/Experiences/${id}`);
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
        this.getExperiences();
      }
    },
    async updateexperience(Experiences, id) {
      try {
        await axios.put(`${this.apiUrl}/v1/experience/${id}`, Experiences);
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
