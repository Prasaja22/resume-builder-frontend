<template>
  <Layout>
    <PageHeader title="Users List" pageTitle="Users" />

    <BRow>
      <BCol lg="12">
        <BCard no-body>
          <BCardBody class="border-bottom">
            <div class="d-flex align-items-center">
              <BCardTitle class="mb-0 flex-grow-1">User List</BCardTitle>
              <div class="flex-shrink-0">
                <BButton
                  class="btn btn-primary me-1"
                  @click="openFormModal('add', null)"
                  >Add User</BButton
                >
                <BModal
                  v-model="isOpenForm"
                  size="lg"
                  id="modal-standard"
                  :title="modalTitle"
                  title-class="font-18"
                  ok-title="Simpan"
                  @ok="saveUser"
                  @hide.prevent
                  @cancel="isOpenForm = false"
                  @close="isOpenForm = false"
                >
                  <BRow>
                    <BCol cols="12">
                      <ImageCropper
                        :aspectRatio="1 / 1"
                        :uploadText="'Letakkan foto disini atau klik untuk mengunggah'"
                        @update:imageUrl="imageUrl = $event"
                        @update:croppedImageUrl="
                          croppedImageUrl = $event;
                          formModel.foto_url = $event;
                        "
                      />
                    </BCol>
                    <BCol cols="12" class="mt-4">
                      <BForm class="form-horizontal" role="form">
                        <BRow class="mb-3">
                          <label class="col-md-2 col-form-label" for="form-name"
                            >Name</label
                          >
                          <BCol md="10">
                            <input
                              class="form-control"
                              :class="{
                                'is-invalid': !!(errorList && errorList.name),
                              }"
                              id="form-name"
                              placeholder="Masukkan Nama"
                              v-model="formModel.name"
                            />
                            <template v-if="!!(errorList && errorList.name)">
                              <div
                                class="invalid-feedback"
                                v-for="(err, index) in errorList.name"
                                :key="index"
                              >
                                <span>{{ err }}</span>
                              </div>
                            </template>
                          </BCol>
                        </BRow>
                        <BRow class="mb-3">
                          <label
                            for="form-email"
                            class="col-md-2 col-form-label"
                            >Email</label
                          >
                          <BCol md="10">
                            <input
                              class="form-control"
                              :class="{
                                'is-invalid': !!(errorList && errorList.email),
                              }"
                              id="form-email"
                              type="email"
                              placeholder="Masukkan email"
                              v-model="formModel.email"
                            />

                            <template v-if="!!(errorList && errorList.email)">
                              <div
                                class="invalid-feedback"
                                v-for="(err, index) in errorList.email"
                                :key="index"
                              >
                                <span>{{ err }}</span>
                              </div>
                            </template>
                          </BCol>
                        </BRow>
                        <BRow class="mb-3">
                          <label
                            for="form-password"
                            class="col-md-2 col-form-label"
                            >Password</label
                          >
                          <BCol md="10">
                            <input
                              class="form-control"
                              :class="{
                                'is-invalid': !!(
                                  errorList && errorList.password
                                ),
                              }"
                              id="form-password"
                              type="password"
                              placeholder="Masukkan password"
                              v-model="formModel.password"
                            />

                            <template
                              v-if="!!(errorList && errorList.password)"
                            >
                              <div
                                class="invalid-feedback"
                                v-for="(err, index) in errorList.password"
                                :key="index"
                              >
                                <span>{{ err }}</span>
                              </div>
                            </template>
                          </BCol>
                        </BRow>
                      </BForm>
                    </BCol>
                  </BRow>
                </BModal>
                <BLink href="#!" class="btn btn-light me-1" @click="getUsers"
                  ><i class="mdi mdi-refresh"></i
                ></BLink>
              </div>
            </div>
          </BCardBody>

          <BCardBody class="border-bottom">
            <BRow class="g-3">
              <BCol xxl="10" lg="8">
                <BFormInput
                  type="text"
                  class="form-control search"
                  placeholder="Search for ..."
                  v-model="userStore.searchQuery"
                />
              </BCol>

              <BCol xxl="2" lg="4">
                <BButton
                  variant="soft-secondary"
                  @click="searchData"
                  class="w-100"
                >
                  <i class="mdi mdi-magnify align-middle"></i>
                  Cari
                </BButton>
              </BCol>
            </BRow>
          </BCardBody>

          <BCardBody>
            <div class="table-responsive">
              <BTableSimple
                class="align-middle dt-responsive nowrap w-100 table-check"
                id="user-list"
              >
                <BThead>
                  <BTr>
                    <BTh scope="col">Name</BTh>
                    <BTh scope="col">Email</BTh>
                    <BTh scope="col"></BTh>
                  </BTr>
                </BThead>

                <BTbody>
                  <BTr v-for="user in rows" :key="user.id">
                    <BTd> {{ user.name }} </BTd>
                    <BTd> {{ user.email }} </BTd>
                    <BTd>
                      <ul
                        class="list-unstyled hstack gap-1 mb-0 justify-content-end"
                      >
                        <li
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          aria-label="Edit"
                          @click="openFormModal('edit', user.id)"
                        >
                          <BButton class="btn btn-sm btn-soft-info"
                            ><i class="mdi mdi-pencil-outline"></i
                          ></BButton>
                        </li>
                        <li
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          aria-label="Delete"
                          @click="deleteUser(user.id)"
                        >
                          <BButton
                            data-bs-toggle="modal"
                            class="btn btn-sm btn-soft-danger"
                            ><i class="mdi mdi-delete-outline"></i
                          ></BButton>
                        </li>
                      </ul>
                    </BTd>
                  </BTr>
                </BTbody>
              </BTableSimple>
            </div>

            <Pagination
              :currentPage="userStore.current"
              :totalRows="userStore.totalData"
              :perPage="userStore.perpage"
              @update:currentPage="updatePage"
            />
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Pagination from "@/components/widgets/pagination";
import { useUserStore } from "@/state/pinia";
import { useProgress } from "@/helpers/progress"; // Import custom progress function
const { startProgress, finishProgress, failProgress } = useProgress();
import ImageCropper from "@/components/widgets/cropper";
import {
  showSuccessToast,
  showErrorToast,
  showDeleteConfirmationDialog,
} from "@/helpers/alert.js";

// import useVuelidate from "@vuelidate/core";

var rows = ref([]);
var isOpenForm = ref(false);
var modalTitle = ref(false);
const userStore = useUserStore();
const getUsers = async () => {
  startProgress();
  await userStore.getUsers();
  if (userStore.users) {
    finishProgress();
    rows.value = userStore.users || [];
  } else {
    failProgress();
    rows.value = [];
  }
};
const updatePage = async (page) => {
  await userStore.changePage(page);
  await getUsers();
};

const searchData = async () => {
  await userStore.changePage(1);
  await getUsers();
};

const imageUrl = ref("");
const croppedImageUrl = ref("");
const formModel = reactive({
  id: "",
  name: "",
  email: "",
  password: "",
  foto_url: "",
});

const openFormModal = (mode, id = null) => {
  isOpenForm.value = true;
  if (mode === "edit" && id) {
    const user = rows.value.find((user) => user.id === id);
    if (user) {
      formModel.id = user.id;
      formModel.name = user.name;
      formModel.email = user.email;
      formModel.password = ""; // Password should be handled securely
      formModel.foto_url = user.foto_url;
      modalTitle.value = "Ubah User";
      imageUrl.value = user.foto_url;
    }
  } else {
    formModel.id = "";
    formModel.name = "";
    formModel.email = "";
    formModel.password = "";
    formModel.foto_url = "";
    modalTitle.value = "Tambah User";
  }
};

const statusCode = computed(() => userStore.response.status);
const errorList = computed(() => userStore.response?.error || {});
const errorMessage = computed(() => userStore.response?.message || "");

const saveUser = async () => {
  try {
    if (formModel.id) {
      await userStore.updateUser(formModel);
      if (statusCode.value != 200) {
        showErrorToast("Failed to add user", errorMessage.value);
      } else {
        isOpenForm.value = false;
        await getUsers(); // Refresh the user list after deletion
        showSuccessToast("User Edited successfully!");
      }
    } else {
      await userStore.addUsers(formModel);

      if (statusCode.value != 200) {
        showErrorToast("Failed to add user", errorMessage.value);
      } else {
        isOpenForm.value = false;
        await getUsers(); // Refresh the user list after deletion
        showSuccessToast("User added successfully!");
      }
    }
  } catch (error) {
    console.error(error);
    showErrorToast("Failed to add user", errorMessage.value);
  }
};

const deleteUser = async (id) => {
  // Tampilkan dialog konfirmasi
  const confirmed = await showDeleteConfirmationDialog();

  // Jika konfirmasi
  if (confirmed) {
    try {
      await userStore.deleteUser(id);
      showSuccessToast("User berhasil dihapus");
      await getUsers(); // Refresh the user list after deletion
    } catch (error) {
      showErrorToast("Terjadi kesalahan saat menghapus user");
    }
  }
};

onMounted(async () => {
  await getUsers();
});
</script>
