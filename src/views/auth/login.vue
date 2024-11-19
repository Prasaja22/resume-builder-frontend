<template>
  <Layout>
    <BRow class="justify-content-center">
      <BCol md="8" lg="6" xl="5">
        <BCard no-body class="overflow-hidden">
          <div class="bg-primary-subtle">
            <BRow>
              <BCol cols="7">
                <div class="text-primary p-4">
                  <h5 class="text-primary">Welcome Back !</h5>
                  <p>Sign in to continue to App.</p>
                </div>
              </BCol>
              <BCol cols="5" class="align-self-end">
                <img
                  src="@/assets/images/profile-img.png"
                  alt
                  class="img-fluid"
                />
              </BCol>
            </BRow>
          </div>
          <BCardBody class="pt-0">
            <div>
              <router-link to="/">
                <div class="avatar-md profile-user-wid mb-4">
                  <span class="avatar-title rounded-circle bg-light">
                    <img src="@/assets/images/logo.svg" alt height="34" />
                  </span>
                </div>
              </router-link>
            </div>

            <BForm class="p-2">
              <BFormGroup
                class="mb-3"
                id="input-group-1"
                label="Email"
                label-for="input-1"
              >
                <BFormInput
                  id="input-1"
                  v-model="formModel.email"
                  type="text"
                  placeholder="Enter email"
                ></BFormInput>
              </BFormGroup>

              <BFormGroup
                class="mb-3"
                id="input-group-2"
                label="Password"
                label-for="input-2"
              >
                <BFormInput
                  id="input-2"
                  v-model="formModel.password"
                  type="password"
                  placeholder="Enter password"
                ></BFormInput>
              </BFormGroup>
              <div class="mt-3 d-grid">
                <BButton
                  type="submit"
                  @click="login"
                  variant="primary"
                  class="btn-block"
                  >Log In</BButton
                >
              </div>
              <!-- <div class="mt-4 text-center">
                <h5 class="font-size-14 mb-3">Sign in with</h5>

                <ul class="list-inline">
                  <li class="list-inline-item">
                    <BLink href="javascript: void(0);" class="
                        social-list-item
                        bg-primary
                        text-white
                        border-primary
                      ">
                      <i class="mdi mdi-facebook"></i>
                    </BLink>
                  </li>
                  <li class="list-inline-item">
                    <BLink href="javascript: void(0);" class="social-list-item bg-info text-white border-info">
                      <i class="mdi mdi-twitter"></i>
                    </BLink>
                  </li>
                  <li class="list-inline-item">
                    <BLink href="javascript: void(0);" class="
                        social-list-item
                        bg-danger
                        text-white
                        border-danger
                      ">
                      <i class="mdi mdi-google"></i>
                    </BLink>
                  </li>
                </ul>
              </div>
              <div class="mt-4 text-center">
                <router-link to="/forgot-password" class="text-muted">
                  <i class="mdi mdi-lock me-1"></i> Forgot your password?
                </router-link>
              </div> -->
            </BForm>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>


<script setup>
import Layout from "../../layouts/auth";
import { reactive, computed } from "vue";
import { useAuthStore } from "@/state/pinia";
import { useRouter } from "vue-router";

import { useProgress } from "@/helpers/progress"; // Import custom progress function
const { startProgress, finishProgress, failProgress } = useProgress();

import { showSuccessToast, showErrorToast } from "@/helpers/alert.js";

const router = useRouter();
const authStore = useAuthStore();

const formModel = reactive({
  email: "",
  password: "",
});

const statusCode = computed(() => authStore.response.status);
// const errorList = computed(() => authStore.response?.list || {});
const errorMessage = computed(() => authStore.response?.message || "");
const login = async () => {
  startProgress();
  try {
    await authStore.login(formModel);
    if (statusCode.value != 200) {
      failProgress()
      showErrorToast("Login failed", errorMessage.value);
    } else {
      finishProgress();
      showSuccessToast("User Logged in !");
      router.push("/");
    }
  } catch (error) {
    console.error(error);
    failProgress()
    showErrorToast("Login failed", errorMessage.value);
  }
};
</script>
