import moment from "moment";

export const getUniqueSlots = (prevSlots, slotData) => {
    console.log('slots')
    let newSlots = [...prevSlots]

    let slotId = 0
    let slotStart = ''
    let slotEnd = ''
    for (let i = 0; i < slotData.length; i++) {
      slotId = slotData[i].Id
      slotStart = slotData[i].Start
      slotEnd = slotData[i].End

      // check for duplication
      if (!newSlots.some(item => item.id === slotId)) {
        newSlots.push({
          id: slotId,
          start: moment(slotStart).toDate(),
          end: moment(slotEnd).toDate(),
        })
      }
    }

    return newSlots
  }
  export const getUniqueReservation = (prevReservation, reservationData, slotData) => {
    let newReservation = [...prevReservation]
    for (let i = 0; i < slotData.length; i++) {
      for (let j = 0; j < reservationData.length; j++) {
        // if reservation match an availablility
        const isValidReservation = reservationData[j].Start >= slotData[i].Start && reservationData[j].Start < slotData[i].End && reservationData[j].End <= slotData[i].End && reservationData[j].End > slotData[i].Start
        if (isValidReservation) {
          // prevent duplication
          if (!newReservation.some(item => item.id === reservationData[j].Id)) {
            newReservation.push(
              {
                id: reservationData[j].Id,
                title: reservationData[j].Title,
                start: moment(reservationData[j].Start).toDate(),
                end: moment(reservationData[j].End).toDate()
              }
            )
          }
        }
      }
    }
    return newReservation
  }