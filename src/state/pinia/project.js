import { defineStore } from "pinia";
import axios from "axios";

export const useProjectstore = defineStore("project", {
  state: () => ({
    apiUrl: import.meta.env.VITE_APP_APIURL,
    projects: [],
    project: null,
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
    openForm(newAction, project) {
      this.modalAction.action = newAction;
      this.project = project;
    },
    async getProjects() {
      try {
        const url = `${this.apiUrl}/v1/projects?page=${this.current}&perPage=${this.perpage}&id=${this.searchQuery}&m_user_id=${this.searchQuery}`;
        const res = await axios.get(url);

        const projectsDataList = res.data.data.list;
        this.projects = projectsDataList;
        this.totalData = res.data.data.meta.total;
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
        };
      }
    },

    async getProjectById(id) {
      try {
        const url = `${this.apiUrl}/v1/project/${id}`;
        const res = await axios.get(url);

        const projectData = res.data.data;
        this.project = projectData;
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
        };
      }
    },

    async changePage(newPage) {
      this.current = newPage;
      await this.getprojects();
    },
    async searchprojects(query) {
      this.searchQuery = query;
      this.current = 1;
      await this.getprojects();
    },
    async addProjects(projects) {
      try {
        const res = await axios.post(`${this.apiUrl}/v1/project`, projects);
        localStorage.setItem("projectId", res.data.data.id);
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
        this.getprojects();
      }
    },
    async deleteproject(id) {
      this.loading = true;
      try {
        await axios.delete(`${this.apiUrl}/v1/projects/${id}`);
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
        this.getprojects();
      }
    },
    async updateProject(projects, id) {
      try {
        await axios.put(`${this.apiUrl}/v1/project/${id}`, projects);
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
