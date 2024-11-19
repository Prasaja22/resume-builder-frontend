import Swal from 'sweetalert2';

// Function to show a success toast
export const showSuccessToast = (title, text = '') => {
  Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });
};

// Function to show an error toast
export const showErrorToast = (title, text = '') => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });
};

// Function to show a delete confirmation dialog
export const showDeleteConfirmationDialog = async (title = "Apakah yakin menghapus data ini?", text = "data yang dihapus tidak bisa dikembalikan!", confirmButtonText = "Hapus", cancelButtonText = "Batal") => {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText
    });
    return result.isConfirmed;
  };

// Function to show a confirmation dialog
export const showConfirmationDialog = async (title, text) => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  });
  return result.isConfirmed;
};
