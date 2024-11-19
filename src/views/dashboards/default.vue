<script setup>

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

// Konfigurasi untuk format Rupiah
const config = {
  decimal: ",",  // Desimal menggunakan koma
  thousands: ".",  // Ribuan dipisahkan dengan titik
  prefix: "Rp. ",  // Prefix untuk mata uang Rupiah
  suffix: "",  // Tidak ada suffix
  precision: 0,  // Precision 0 agar tidak ada angka desimal
  masked: false,  // Tidak menggunakan masked
}
</script>

<template>
  <Layout>
    <PageHeader title="Default" pageTitle="Dashboards" />

    <div>
      <label for="regexp-mask" class="form-label">Dynamic mask</label>
      <BFormInput type="text" v-maska :data-maska="['#.### cm']" class="form-control" id="regexp-mask" />
      <div class="text-muted">["# cm", "#.# cm", "#.## cm"]</div>

      <!-- Input untuk Rupiah dengan v-money3 -->
      <label for="rupiah-input" class="form-label">Masukkan Nilai Rupiah</label>
      <BFormInput type="text" class="form-control" id="rupiah-input" v-money3="config" />

    </div>
  </Layout>
</template>
