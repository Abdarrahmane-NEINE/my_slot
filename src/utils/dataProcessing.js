import moment from "moment";

export const getUniqueSlots = (prevSlots, slotData) => {
    console.log('slots')
    let newSlots = [...prevSlots]

    let slotId = 0
    let slotStart = ''
    let slotEnd = ''
    for (let i = 0; i < slotData.length; i++) {
      slotId = slotData[i].id
      slotStart = slotData[i].start
      slotEnd = slotData[i].end

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
        const isValidReservation = reservationData[j].start >= slotData[i].start && reservationData[j].start < slotData[i].end && reservationData[j].end <= slotData[i].end && reservationData[j].end > slotData[i].start
        if (isValidReservation) {
          // prevent duplication
          if (!newReservation.some(item => item.id === reservationData[j].id)) {
            newReservation.push(
              {
                id: reservationData[j].id,
                title: reservationData[j].title,
                start: moment(reservationData[j].start).toDate(),
                end: moment(reservationData[j].end).toDate()
              }
            )
          }
        }
      }
    }
    return newReservation
  }