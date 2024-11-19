<template>
  <div
    v-if="!localCroppedImageUrl"
    class="dropzone"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
    :class="{ 'dropzone-active': isDragging }"
  >
    <label for="dropzoneFile"  role="button">
      <div class="dz-message needsclick text-center">
        <div class="mb-3">
          <i class="display-4 text-muted bx bxs-cloud-upload"></i>
        </div>
        <h4>{{uploadText}}</h4>
      </div>
    </label>
    <input
      type="file"
      id="dropzoneFile"
      class="dropzoneFile btn btn-light"
      @change="onFileChange"
    />
  </div>
  <BModal
    v-model="cropModal"
    title="Crop Image"
    ok-title="Crop"
    @ok="cropImage"
  >
    <vue-cropper
      v-if="localImageUrl"
      ref="cropper"
      :src="localImageUrl"
      :aspect-ratio="aspectRatio"
      :view-mode="1"
      :auto-crop-area="1"
      :background="false"
      :guides="false"
      class="cropper"
    />
  </BModal>
  <div v-if="localCroppedImageUrl" class="preview d-flex">
    <div class="delete-button" @click="clearCroppedImage">
      <BButton class="btn btn-sm btn-danger"
        ><i class="mdi mdi-delete-outline"></i
      ></BButton>
    </div>
    <img :src="localCroppedImageUrl" alt="Cropped Image" class="mx-auto" />
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

export default {
  name: "ImageCropper",
  components: {
    VueCropper,
  },

  props: {
    imageUrl: {
      type: String,
      default: null,
    },
    croppedImageUrl: {
      type: String,
      default: null,
    },
    aspectRatio: {
      type: Number,
      default: 1,
    },
    uploadText: {
      type: String,
      default: "Letakkan gambar disini atau klik untuk mengunggah",
    },
  },
  data() {
    return {
      isDragging: false,
      cropModal: false,
      localImageUrl: this.imageUrl,
      localCroppedImageUrl: this.croppedImageUrl,
    };
  },
  watch: {
    localImageUrl(newVal) {
      this.$emit("update:imageUrl", newVal);
    },
    localCroppedImageUrl(newVal) {
      this.$emit("update:croppedImageUrl", newVal);
    },
  },
  methods: {
    onDragOver() {
      this.isDragging = true;
    },
    onDragLeave() {
      this.isDragging = false;
    },
    onDrop(event) {
      this.isDragging = false;
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const fileInputEvent = {
          target: {
            files: [files[0]],
          },
        };
        this.onFileChange(fileInputEvent);
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.localImageUrl = URL.createObjectURL(file);
        this.cropModal = true;
      }
    },
    cropImage() {
      const canvas = this.$refs.cropper.getCroppedCanvas();
      if (canvas) {
        this.localCroppedImageUrl = canvas.toDataURL("image/png");
      }
    },
    clearCroppedImage() {
      this.localCroppedImageUrl = null;
      this.localImageUrl = null;
    },
  },
};
</script>

<style scoped lang="scss">
.image-cropper {
  text-align: center;
}
.cropper {
  max-width: 100%;
  margin-top: 20px;
}
.preview {
  border: 2px dashed var(--bs-border-color) !important;
  border-radius: 6px;
  margin-top: 20px;
}
.preview img {
  max-width: 100%;
}
.dropzone {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 16px;
  background-color: #fff;
  transition: 0.3s ease all;
  height: 200px;

  label {
    padding: 8px 12px;
    font-size: 14p;
    color: #fff;
    color: #000;
    transition: 0.3s ease all;

    &::after {
      height: 0px;
    }
  }

  input {
    display: none;
  }
}

.active-dropzone {
  color: #fff;
  border-color: #fff;
  label {
    background-color: #fff;
  }
}

.delete-button {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
