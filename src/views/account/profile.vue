<template>
  <Layout>
    <PageHeader title="User Profile" pageTitle="Dashboards" />

    <div class="profile-card p-3 border rounded-3">
      <!-- Background gradient -->
      <div class="background-gradient rounded-top"></div>

      <!-- Profile content -->
      <div class="d-flex flex-column align-items-start position-relative">
        <!-- Profile Image -->
        <img
          v-if="formModel && formModel.photo_url"
          :src="formModel.photo_url"
          alt="Profile Picture"
          class="profile-picture rounded-circle border border-3 mb-2 img-fluid"
        />

        <!-- Profile Info -->
        <div class="profile-info d-flex flex-column align-items-start">
          <h4
            class="mt-5 mb-1"
            spellcheck="false"
            data-toggle="tooltip"
            title="Click to edit name"
            style="cursor: pointer"
          >
            <span
              v-bind:contenteditable="true"
              v-text="formModel.name"
              @blur="updateField('name', $event)"
              class="grow-text"
            ></span>
            <i class="fas fa-feather" style="margin-left: 8px"></i>
          </h4>
          <p class="text-muted mb-1">
            <i class="fas fa-envelope" style="margin-right: 8px"></i>
            <span
              v-bind:contenteditable="false"
              v-text="formModel.email"
              @blur="updateField('email', $event)"
              class="grow-text"
            ></span>
          </p>
          <!-- Editable Phone Number -->
          <p
            class="text-muted"
            data-toggle="tooltip"
            title="Click to edit phone number"
          >
            <i class="fas fa-address-card" style="margin-right: 8px"></i>
            <span
              v-bind:contenteditable="true"
              v-text="formModel.phone_number"
              @blur="updateField('phone_number', $event)"
            ></span>
          </p>
          <p class="text-muted mb-1" spellcheck="false">
            <span
              v-bind:contenteditable="true"
              v-text="formModel.address"
              @blur="updateField('address', $event)"
              class="grow-text"
            ></span>
          </p>
          <p class="text-muted" spellcheck="false">
            <span
              v-bind:contenteditable="true"
              v-text="formModel.summary"
              @blur="updateField('summary', $event)"
              class="grow-text"
            ></span>
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary" @click="saveUser">
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <div class="profile-card p-3 border rounded-3 mt-4">
      <!-- Background gradient -->
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'project' }"
            @click.prevent="switchTab('project')"
            href="#"
          >
            Project
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'education' }"
            @click.prevent="switchTab('education')"
            href="#"
          >
            Education
          </a>
        </li>
      </ul>

      <!-- Profile Tab Content -->
      <div
        v-if="activeTab === 'education'"
        class="profile-card p-3 border rounded-3"
      >
        <h1>Hello</h1>
      </div>

      <!-- Resume Options Tab Content -->
      <div
        v-if="activeTab === 'project'"
        class="profile-card p-3 border rounded-3 mt-4"
      >
        <h5 class="fw-bold mb-4">Pilih Draft Project</h5>
        <div
          class="plan-option mb-3"
          v-for="option in projectStore.projects"
          :key="option.id"
        >
          <div class="form-check d-flex align-items-start">
            <input
              type="radio"
              :id="option.id"
              :value="option.id"
              v-model="selectedPlan"
              class="form-check-input mt-1"
            />
            <label :for="option.id" class="form-check-label ms-2">
              <div v-html="option.description"></div>
            </label>
          </div>
          <hr />
        </div>
        <button class="btn btn-primary mt-4 w-100" @click="startTrial">
          Pilih Template Draft yang telah anda buat
        </button>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { reactive, onMounted, ref, nextTick } from "vue";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { useAuthStore } from "../../state/pinia/auth";
import { useUserStore, useProjectstore } from "@/state/pinia";
import { showSuccessToast, showErrorToast } from "@/helpers/alert.js";

const authStore = useAuthStore();
const userStore = useUserStore();
const projectStore = useProjectstore();

const activeTab = ref("project");

const scrollPosition = ref(0);

const switchTab = (tab) => {
  scrollPosition.value = window.scrollY;
  activeTab.value = tab;

  nextTick(() => {
    window.scrollTo(0, scrollPosition.value);
  });
};

const formModel = reactive({
  id: "",
  name: "",
  email: "",
  password: "",
  phone_number: "Kosong...",
  photo_url: "",
  summary: "Pekerjaan anda | Pejerjaan anda",
  address: "Ubah alamat kamuu disini...",
});

const getData = async () => {
  projectStore.searchQuery = formModel.id;
  await projectStore.getProjects();

  const userId = authStore.getUser().id;
  if (userId) {
    await userStore.getUserById(userId);
    const userData = userStore.user;
    if (userData) {
      formModel.id = userData.id;
      formModel.name = userData.name;
      formModel.email = userData.email;
      formModel.phone_number = userData.phone_number;
      formModel.photo_url = userData.photo_url;
      formModel.summary = userData.summary ?? formModel.summary;
      formModel.address = userData.address ?? formModel.address;
    }
  }
};

const updateField = (field, event) => {
  formModel[field] = event.target.innerText;
};

const saveUser = async () => {
  try {
    await userStore.updateUser(formModel);
    showSuccessToast("User updated successfully!");

    const res = userStore.response.status;

    if (res != 200) {
      showErrorToast("Failed to update user");
    }
  } catch (e) {
    console.error(e);
    showErrorToast("Failed to update user");
  }
};

const selectedPlan = ref("");

const startTrial = () => {
  if (selectedPlan.value) {
    localStorage.setItem("projectId", selectedPlan.value);
  } else {
    console.log("Please select a plan.");
  }
};

onMounted(async () => {
  await getData();

  const storedProjectId = localStorage.getItem("projectId");
  if (storedProjectId) {
    selectedPlan.value = storedProjectId;
  }
});
</script>

<style scoped>
.profile-card {
  max-width: 800px;
  margin: 0 auto;
  background: white;
}

.background-gradient {
  height: 200px;
  background: linear-gradient(
    90deg,
    rgba(255, 183, 197, 1) 0%,
    rgba(200, 225, 255, 1) 100%
  );
}

.profile-info {
  margin-top: 50px;
}

hr {
  height: 0.4px; /* Ketebalan garis */
  background-color: #706e6e; /* Warna garis */
  border: none; /* Hilangkan border default */
  margin: 20px 0; /* Jarak vertikal */
}

.profile-picture {
  width: 200px;
  height: 200px;
  position: absolute;
  top: -120px;
  left: 30px;
}

.grow-text {
  transition: transform 0.3s ease, font-size 0.3s ease;
}

.grow-text:focus {
  transform: scale(1.2); /* Grow the text by 20% */
  font-size: 1.2em; /* Optionally increase font size */
  color: #7084e7;
  font-weight: 600;
}
</style>
