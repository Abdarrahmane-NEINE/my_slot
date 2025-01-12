import Swal from 'sweetalert2';

const showAlert = ({
  title = 'Alert',
  text = '',
  icon = 'info',
  confirmButtonText = 'OK',
  showConfirmButton = true,
  showCancelButton = false,
  cancelButtonText = 'Cancel',
  position = 'center',
  timer = null
} = {}) => {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    showConfirmButton,
    showCancelButton,
    cancelButtonText,
    position,
    timer
  });
};

export default showAlert;
