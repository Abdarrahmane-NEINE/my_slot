import React, { useCallback, useState, useRef, buildMessage, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import events from "./events";
import slots from "./slots";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

import DatePicker from 'react-datepicker'

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

export default function ReactBigCalendar() {

  const [reservationsData, setReservationsData] = useState(events);
  const [slotData, setSlotData] = useState(events)
  
  const [reservation, setReservation] = useState(false)
  const [slot, setSlot] = useState(false)
  const [email, setEmail]= useState("")
  const [title, setTitle]= useState("")

  const [start, setStart]= useState(new Date)
  const [end, setEnd]= useState(new Date)

  const showSlot = () => setSlot(true)
  const CloseSlot = () => setSlot(false)

  const showReservation = () => setReservation(true)
  const CloseReservation = () => setReservation(false)

  // create new reservation
  const CreateReservation = () => {
    setReservationsData([
      ...reservationsData,
      {
        title,
        start,
        end
      }
    ]);
    //close modal
    CloseReservation()
  }
  return (
    <>
    <div className="App">
      <Button variant="primary" onClick={showSlot} >
              Add time slot
      </Button>
      <Button variant="primary" onClick={showReservation} >
              Create reservation
      </Button>
      {/* handle reservation */}
      <Modal show={slot} fullscreen={true} onHide={CloseSlot}>
        <Modal.Header closeButton>
          <Modal.Title>Available Slots</Modal.Title>
        </Modal.Header>
        <Modal.Body>      
          <Calendar
            views={["day", "work_week"]}
            selectable
            localizer={localizer}
            // defaultDate={new Date()}
            defaultView="day"
            // events={slotsData}
            style={{ height: "100vh" }}
            // onSelectEvent={(event) => alert(event.title)}
            // onSelectSlot={}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={CloseSlot}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* add reservation */}
      <Modal show={reservation} onHide={CloseReservation}>
        <Modal.Header closeButton>
          <Modal.Title>Add reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group className="mb-3" controlId="formEmail" >
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="your email" 
                autoFocus
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
                // onChange={(e) => setReservationsData({email : e.target.value})}
                hasValidation={false}
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTitle" >
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="reservation title" 
                autoFocus
                defaultValue={title}
                onChange={(e) => setTitle(e.target.value)}
                hasValidation={false}
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTitle" >
              <Form.Label>Start Reservation</Form.Label>
              <DatePicker 
              selected={start} 
              onChange={(date) => setStart(date)}
              showTimeSelect
              showMonthDropdown
              // minTime={setHours(setMinutes(new Date(), 0), 17)}
              // maxTime={setHours(setMinutes(new Date(), 30), 20)}
              dateFormat="MM/d/yyyy h:mm aa"
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTitle" >
              <Form.Label>End Reservation</Form.Label>
              <DatePicker 
              selected={end} 
              onChange={(date) => setEnd(date)}
              showTimeSelect
              showMonthDropdown
              // minTime={setHours(setMinutes(new Date(), 0), 17)}
              // maxTime={setHours(setMinutes(new Date(), 30), 20)}
              dateFormat="MM/d/yyyy h:mm aa"
              />
          </Form.Group>
          </Form>
          {/* <DatePicker selected={start} onChange={(date) => setStart(date)} /> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={CloseReservation}>
            Cancel
          </Button>
          <Button variant="primary" onClick={CreateReservation}>
          {/* <Button variant="primary" onClick={e => AddReservation(e)}> */}
            Create
          </Button>
        </Modal.Footer>
      </Modal>
      <Calendar
        // views={["day", "agenda", "work_week", "month"]}
        views={["day", "agenda", "work_week"]}
        // selectable
        localizer={localizer}
        // defaultDate={new Date()}
        defaultView="day"
        events={reservationsData}
        // events={{
        //   id: 0,
        //   title: "All Day Event very long title",
        //   allDay: true,
        //   start: new Date,
        //   end: new Date
        //   // start: new Date(2022, 8, 12),
        //   // end: new Date(2022, 9, 3)
        // }}
        style={{ height: "100vh" }}
        // onSelectEvent={(event) => alert(event.title)}
        // onSelectSlot={handleSelect}
      />
    </div>
  </>
  );
}
