<template>
  <div class="custom-modal">
    <div class="modal-header">
      <button @click="closeModal" class="close-button">&times;</button>
    </div>
    <div class="modal-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import "../../../assets/css/resume.css";

export default {
  name: "Modal",
  emits: ["close"],
  methods: {
    closeModal() {
      this.$emit("close"); // Memancarkan event close ke komponen induk
    },
  },
};
</script>
