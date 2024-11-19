<template>
  <Layout>
    <div class="container-fluid">
      <div class="row vh-100">
        <div
          class="col-md-12 content py-4 d-flex flex-column align-items-center position-relative"
        >
          <div class="resume-canvas-wrapper position-relative" id="print">
            <!-- Save Resume and Settings Buttons -->
            <div
              class="d-flex justify-content-between w-100 position-absolute top-0 start-0 p-3"
              style="z-index: 10"
            >
              <button @click="saveResume" class="btn btn-primary">
                <i class="fas fa-save"></i> Save Resume
              </button>
              <button @click="toggleZoomControls" class="btn btn-info">
                <i class="fas fa-cog"></i>
              </button>
            </div>

            <!-- Zoom Controls (Shown/Hidden based on isZoomVisible) -->
            <div
              class="zoom-controls position-absolute top-50 end-0 translate-middle-y me-3"
              :class="{ hide: !isZoomVisible }"
              style="z-index: 10"
            >
              <button @click="zoomIn" class="btn btn-primary my-2">
                <i class="fas fa-search-plus"></i>
              </button>

              <button @click="zoomOut" class="btn btn-danger my-2">
                <i class="fas fa-search-minus"></i>
              </button>

              <button @click="resetZoom" class="btn btn-secondary my-2">
                <i class="fas fa-sync-alt"></i>
              </button>

              <button @click="printResume" class="btn btn-success my-2">
                <i class="fas fa-print"></i>
              </button>
            </div>

            <div
              ref="resumeCanvas"
              class="resume-canvas"
              :style="{
                transform: `scale(${zoomLevel})`,
                top: `${canvasY}px`,
                left: `${canvasX}px`,
              }"
              @wheel="handleScrollZoom"
              @mousedown="startDrag"
              @mouseup="stopDrag"
              @mousemove="dragging"
              @mouseleave="stopDrag"
              @dblclick.prevent
            >
              <div
                class="d-flex justify-content-start align-items-start mt-4 mb-2"
                style="pointer-events: none"
              >
                <div class="profile-photo me-5 ms-5">
                  <img
                    src="@/assets/images/users/avatar-1.jpg"
                    class="img-fluid rounded-circle"
                    alt="User Avatar"
                    style="width: 150px; height: 150px"
                  />
                </div>

                <div
                  class="profile-info text-start"
                  style="pointer-events: all"
                >
                  <h2
                    class="profile-name"
                    contenteditable="true"
                    @input="updateField('name', $event)"
                  >
                    {{ resumeData.name }}
                  </h2>

                  <div class="contact-info">
                    <p>
                      <i class="fas fa-phone"></i>
                      <span
                        contenteditable="true"
                        @input="updateField('phone', $event)"
                      >
                        {{ resumeData.phone }}
                      </span>
                    </p>

                    <p>
                      <i class="fas fa-envelope" style="margin-right: 2px"></i>
                      <span
                        contenteditable="true"
                        @input="updateField('email', $event)"
                      >
                        {{ resumeData.email }}
                      </span>
                    </p>

                    <p>
                      <i
                        class="fas fa-map-marker-alt"
                        style="margin-right: 2px"
                      ></i>
                      <span
                        contenteditable="true"
                        @input="updateField('address', $event)"
                        class="editable-text"
                      >
                        {{ resumeData.address }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- <div class="mt-4 mb-2" style="pointer-events: all">
                      <h4 class="section-title">Ringkasan</h4>
                      <div class="border-dashed p-3"></div>
                    </div> -->
              <div class="col-md-12 mb-3">
                <h5 class="section-title">Ringkasan</h5>

                <!-- Trigger untuk Popup Modal Ringkasan -->
                <div class="border-dashed p-3" @click="openModal('summary')">
                  <div v-html="summaryData.description"></div>
                </div>
              </div>

              <!-- Popup Modal untuk Ringkasan -->
              <div
                v-if="currentModal === 'summary'"
                class="custom-modal-overlay"
                @click.self="closeModal"
              >
                <Modal @close="closeModal">
                  <QuillEditor
                    v-model:content="summaryData.description"
                    content-type="html"
                    :toolbar="['bold', 'italic', 'underline', 'link']"
                  />
                </Modal>
              </div>

              <div class="row" style="pointer-events: all">
                <div class="col-md-6 mb-1">
                  <h5 class="section-title">Riwayat Pekerjaan</h5>
                  <div
                    class="border-dashed p-3"
                    @click="openModal('pekerjaan')"
                  >
                    <div v-html="experienceData.description"></div>
                  </div>
                </div>

                <div
                  v-if="currentModal === 'pekerjaan'"
                  class="custom-modal-overlay"
                  @click.self="closeModal"
                >
                  <Modal @close="closeModal">
                    <QuillEditor
                      v-model:content="experienceData.description"
                      content-type="html"
                      :toolbar="['bold', 'italic', 'underline', 'link']"
                    />
                  </Modal>
                </div>

                <div class="col-md-6 mb-1">
                  <h5 class="section-title">Pendidikan</h5>
                  <div
                    class="border-dashed p-3"
                    @click="openModal('pendidikan')"
                  >
                    <div v-html="educationData.description"></div>
                  </div>
                </div>

                <!-- Popup Modal untuk Ringkasan -->
                <div
                  v-if="currentModal === 'pendidikan'"
                  class="custom-modal-overlay"
                  @click.self="closeModal"
                >
                  <Modal @close="closeModal">
                    <QuillEditor
                      v-model:content="educationData.description"
                      content-type="html"
                      :toolbar="[
                        'bold',
                        'italic',
                        'underline',
                        'link',
                        { list: 'bullet' },
                      ]"
                    />
                  </Modal>
                </div>

                <div class="col-md-12 mb-3">
                  <h5 class="section-title">Hasil Pekerjaan</h5>

                  <p class="count">{{ charCount }}/1500</p>

                  <!-- Trigger untuk Popup Modal -->
                  <div
                    class="border-dashed p-3"
                    @click="openModal('riwayatKerja')"
                  >
                    <!-- <p>{{ resumeData.riwayatKerja }}</p> -->
                    <div v-html="projectData.description"></div>
                  </div>
                </div>

                <!-- Popup Modal hasil pekerjaan-->
                <div
                  v-if="currentModal === 'riwayatKerja'"
                  class="custom-modal-overlay"
                  @click.self="closeModal"
                >
                  <Modal @close="closeModal">
                    <QuillEditor
                      v-model:content="projectData.description"
                      content-type="html"
                      :toolbar="[
                        'bold',
                        'italic',
                        'underline',
                        'link',
                        { list: 'bullet' },
                      ]"
                      @update:content="limitContentLength"
                    />
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import Layout from "../../layouts/main";
import "../../assets/css/resume.css";
import printJS from "print-js";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import Modal from "./modal/modal.vue";
import {
  useExperiencestore,
  useEducationstore,
  useProjectstore,
  useSummariestore,
} from "@/state/pinia";
import { showSuccessToast, showErrorToast } from "@/helpers/alert.js";

const currentModal = ref(null);
const zoomLevel = ref(1);
const isDragging = ref(false);
const lastMouseX = ref(0);
const lastMouseY = ref(0);
const canvasX = ref(0);
const canvasY = ref(0);
const isZoomVisible = ref(true);

const experienceStore = useExperiencestore();
const educationStore = useEducationstore();
const projectStore = useProjectstore();
const summarieStore = useSummariestore();

const resumeData = reactive({
  name: "Mark",
  phone: "093123213",
  email: "Mark@gmail.com",
  address: "Jl.Kenangan Malang Jawa Timur",
});

const authUser = JSON.parse(localStorage.getItem("user"));

const experienceData = reactive({
  m_user_id: authUser.id,
  description: "<li>PT.Mencari cinta sejati 2018</li>",
});

const educationData = reactive({
  m_user_id: authUser.id,
  description: "<li>SMKN 5 Blitar</li>",
});

const projectData = reactive({
  m_user_id: authUser.id,
  description: "lala",
});

const summaryData = reactive({
  m_user_id: authUser.id,
  description: "lala",
});

const getResumes = async () => {
  if (localStorage.getItem("experienceId")) {
    experienceStore.searchQuery = localStorage.getItem("experienceId");
    await experienceStore.getExperiences();

    const userData = experienceStore.experiences[0];
    if (userData) {
      experienceData.description = userData.description;
    }
  }

  if (localStorage.getItem("educationId")) {
    educationStore.searchQuery = localStorage.getItem("educationId");
    await educationStore.getEducations();

    const userData = educationStore.educations[0];
    if (userData) {
      educationData.description = userData.description;
    }
  }

  if (localStorage.getItem("projectId")) {
    projectStore.searchQuery = localStorage.getItem("projectId");
    await projectStore.getProjectById(localStorage.getItem("projectId"));

    const userData = projectStore.project;
    if (userData) {
      projectData.description = userData.description;
    }
  }

  if (localStorage.getItem("summaryId")) {
    summarieStore.searchQuery = localStorage.getItem("summaryId");
    await summarieStore.getSummaries();

    const userData = summarieStore.summaries[0];
    if (userData) {
      summaryData.description = userData.description;
    }
  }
};

const saveResume = async () => {
  const entities = [
    {
      idKey: "experienceId",
      store: experienceStore,
      data: experienceData,
      add: "addExperiences",
      update: "updateexperience",
    },
    {
      idKey: "educationId",
      store: educationStore,
      data: educationData,
      add: "addeducations",
      update: "updateeducation",
    },
    {
      idKey: "projectId",
      store: projectStore,
      data: projectData,
      add: "addProjects",
      update: "updateProject",
    },
    {
      idKey: "summaryId",
      store: summarieStore,
      data: summaryData,
      add: "addSummaries",
      update: "updatesummary",
    },
  ];

  try {
    for (const entity of entities) {
      const id = localStorage.getItem(entity.idKey);
      if (!id) {
        await entity.store[entity.add](entity.data);
      } else {
        await entity.store[entity.update](entity.data, id);
      }
    }
    showSuccessToast("Resume updated successfully!");
  } catch (e) {
    console.error(e);
    showErrorToast("Failed to update user");
  }
};

const charCount = computed(() => projectData.description.length);

function limitContentLength(content) {
  const maxLength = 1500;
  projectData.des =
    content.length > maxLength ? content.substring(0, maxLength) : content;
}

function openModal(modalName) {
  currentModal.value = modalName;
}

function closeModal() {
  currentModal.value = null;
}

function zoomIn() {
  if (zoomLevel.value < 2) zoomLevel.value += 0.1;
}

function zoomOut() {
  if (zoomLevel.value > 1) zoomLevel.value -= 0.1;
  else resetZoom();
}

function resetZoom() {
  zoomLevel.value = 1;
  canvasX.value = 0;
  canvasY.value = 0;
}

function handleScrollZoom(event) {
  if (event.ctrlKey) {
    event.deltaY < 0 ? zoomIn() : zoomOut();
    event.preventDefault();
  }
}

function startDrag(event) {
  if (zoomLevel.value !== 1) {
    isDragging.value = true;
    lastMouseX.value = event.clientX;
    lastMouseY.value = event.clientY;
  }
}

function stopDrag() {
  isDragging.value = false;
}

function dragging(event) {
  if (isDragging.value) {
    canvasX.value += event.clientX - lastMouseX.value;
    canvasY.value += event.clientY - lastMouseY.value;
    lastMouseX.value = event.clientX;
    lastMouseY.value = event.clientY;
  }
}

function updateField(field, event) {
  resumeData[field] = event.target.innerText;
}

function toggleZoomControls() {
  isZoomVisible.value = !isZoomVisible.value;
}

function printResume() {
  closeModal();
  resetZoom();

  setTimeout(() => {
    printJS({
      printable: document.querySelector(".resume-canvas"),
      type: "html",
      targetStyles: ["*"],
      style: `
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }  
          .zoom-controls,
          button {
            display: none;
          }
          .border-dashed {
            border: none !important;
          }
          .count {
            display: none !important;
          }
          .resume-canvas {
            overflow: visible !important; /* Allow content overflow to be visible */
            transform: scale(0.8); /* Adjust this scale as needed */
            transform-origin: top left; 
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `,
    });
  }, 2000);
}

onMounted(async () => {
  await getResumes();
});

watch(
  () => localStorage.getItem("projectId"),
  async (newProjectId, oldProjectId) => {
    if (newProjectId !== oldProjectId) {
      // Hanya jika projectId berubah
      await getResumes();
    }
  },
  { immediate: true } // untuk memulai watch segera setelah komponen dimuat
);
</script>
