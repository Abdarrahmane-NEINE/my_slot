import Swal from "sweetalert2";
import moment from "moment";
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
// confirm slot
export const confirmSlot = async (start, end) => {
  const result = await Swal.fire({
    title: "Confirm Slot Creation",
    text: `Do you want to create a slot between ${moment(start).format('DD/MM/YYYY HH:mm')} and ${moment(end).format('DD/MM/YYYY HH:mm')}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, create it!",
    cancelButtonText: "No, cancel",
  });

  return result.isConfirmed;
};
