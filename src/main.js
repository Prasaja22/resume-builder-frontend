import { createApp } from 'vue'

import App from './App.vue'
import router from "./router";
import VueApexCharts from "vue3-apexcharts";
import vClickOutside from "click-outside-vue3";
import { registerScrollSpy } from 'vue3-scroll-spy';

import { vMaska } from "maska"

import BootstrapVueNext from 'bootstrap-vue-next'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import "@/assets/scss/app.scss";
import "@vueform/multiselect/themes/default.css"

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

// PINIA
import pinia from '@/state/pinia'

import 'sweetalert2/dist/sweetalert2.min.css';
import '@vueform/slider/themes/default.css';
import VueProgressBar from '@aacassandra/vue3-progressbar'
import { Money3Directive } from 'v-money3'

// Konfigurasi vue-progressbar
const rootStyles = getComputedStyle(document.documentElement);
const primaryColor = rootStyles.getPropertyValue('--bs-primary').trim();
const dangerColor = rootStyles.getPropertyValue('--bs-danger').trim();

const optionsProgressBar = {
  color: primaryColor,
  failedColor: dangerColor,
  thickness: '5px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}



const app = createApp(App)
  .use(pinia)
  .use(router)
  .use(require('vue-chartist'))
  .use(BootstrapVueNext)
  .use(VueApexCharts)
  .use(vClickOutside)
  .use(VueProgressBar, optionsProgressBar)
  .use(registerScrollSpy)
  .directive("maska", vMaska)
  .directive('money3', Money3Directive)

// Tambahkan VueProgressBar ke globalProperties
app.config.globalProperties.$Progress = app.config.globalProperties.$Progress || {};
app.component('VueDatePicker', VueDatePicker);

app.mount('#app')
