import Swal from "sweetalert2";

// confirm deletion
export const confirmDeletion = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this item?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel",
  });

  return result.isConfirmed;
};
