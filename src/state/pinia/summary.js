import { defineStore } from "pinia";
import axios from "axios";

export const useSummariestore = defineStore("summary", {
  state: () => ({
    apiUrl: import.meta.env.VITE_APP_APIURL,
    summaries: [],
    summary: null,
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
    openForm(newAction, summary) {
      this.modalAction.action = newAction;
      this.summary = summary;
    },
    async getSummaries() {
      try {
        const url = `${this.apiUrl}/v1/summary?page=${this.current}&perPage=${this.perpage}&id=${this.searchQuery}`;
        const res = await axios.get(url);

        const SummariesDataList = res.data.data.list;
        this.summaries = SummariesDataList;
        this.totalData = res.data.data.meta.total;
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
        };
      }
    },

    async getsummaryById(id) {
      try {
        const url = `${this.apiUrl}/v1/summary/${id}`;
        const res = await axios.get(url);

        const summaryData = res.data.data;
        this.summary = summaryData;
      } catch (error) {
        this.response = {
          status: error.response?.status,
          message: error.message,
        };
      }
    },

    async changePage(newPage) {
      this.current = newPage;
      await this.getSummaries();
    },
    async searchSummaries(query) {
      this.searchQuery = query;
      this.current = 1;
      await this.getSummaries();
    },
    async addSummaries(summaries) {
      try {
        const res = await axios.post(`${this.apiUrl}/v1/summary`, summaries);
        localStorage.setItem("summaryId", res.data.data.id);
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
        this.getSummaries();
      }
    },
    async deletesummary(id) {
      this.loading = true;
      try {
        await axios.delete(`${this.apiUrl}/v1/summary/${id}`);
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
        this.getSummaries();
      }
    },
    async updatesummary(Summaries, id) {
      try {
        await axios.put(`${this.apiUrl}/v1/summary/${id}`, Summaries);
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
