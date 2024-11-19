import axios from 'axios';
import {
    showErrorToast,
    showConfirmationDialog
} from '@/helpers/alert';
import { useAuthStore } from "@/state/pinia";


export function axiosInterceptors() {
  const auth = useAuthStore();

    axios.interceptors.request.use(config => {
        const token = auth.getToken(); // Mengakses Pinia store dari globalProperties

        // if (['GET', 'PUT', 'POST', 'DELETE'].includes(config.method.toUpperCase())) {
        // }

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Menambahkan token ke header
        }

        if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json'; // Menetapkan Content-Type jika tidak ada
        }

        config.headers['Accept'] = 'application/json'; // Menetapkan Accept header

        return config;
    }, error => {
        showErrorToast('Request Error', 'Terjadi kesalahan pada request'); // Menampilkan toast error
        return Promise.reject(error);
    });

    axios.interceptors.response.use(response => {
        return response;
    }, async error => {
        if (error.response && [403, 401].includes(error.response.status)) {
            // Menampilkan konfirmasi sebelum melakukan logout jika error 403 atau 401
            const confirmed = await showConfirmationDialog(
                'Ooops',
                error.response.data.errors[0] || 'Terjadi kesalahan pada response'
            );
            if (confirmed) {
                await auth.logout(); // Menghapus token dari Pinia store dan localStorage
                window.location.reload(); // Memuat ulang halaman
            }
        } else {
            showErrorToast('Error', 'Terjadi kesalahan pada response'); // Menampilkan toast error untuk kesalahan lainnya
        }

        return Promise.reject(error);
    });
}
