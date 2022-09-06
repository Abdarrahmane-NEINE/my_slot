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

import { variables } from "../variablesApi";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);


export default function ReactBigCalendar() {

  const [reservationsData, setReservationsData] = useState(events);
  const [slotsData, setSlotsData] = useState(events)

  const [slot, setSlot] = useState(false)
  const [addSlot, setAddSlot] = useState(false)
  const [isSlotAvailable, setIsSlotAvailable] = useState(false)

  const [reservation, setReservation] = useState(false)
  const [email, setEmail]= useState("")
  const [title, setTitle]= useState("")

  const [start, setStart]= useState(new Date)
  const [end, setEnd]= useState(new Date)


  // availabilities's state
  const [availabilities, setAvailabilities] = useState([])
  const [modalTitle, setModalTitle] = useState("")
  const [availabilitieId, setAvailabilitieId] = useState(0)
  const [availabilitieStart, setAvailabilitieStart] = useState(new Date)
  const [availabilitieEnd, setAvailabilitieEnd] = useState(new Date)
  const [availabilitieCreatedAt, setAvailabilitieCreatedAt] = useState("")

  // reservations's state
  // const [] = useState()
  // const [] = useState()


  // get availabilitie's data
  const refreshAvailabilitie = () =>  {

    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    fetch(variables.ApiUrl+'availabilitie',
      {
      method:'GET',
      headers:headers,
      }
    )
    .then(res=>res.json())
    .then(
      (response)=>{
      setAvailabilities([
        ...availabilities,
        {
          response
        }
      ])
      },
      (error) => {
        alert(error)
      }
    )
  }

  let componentDidMount = () => {
    refreshAvailabilitie()
  }

  let changeAvailabilitieStart = (e) => {
    setAvailabilitieStart(e.target.value)
  }
  let changeAvailabilitieEnd = (e) => {
    setAvailabilitieStart(e.target.value)
  }

  //create availabilitie
  const createAvailabilitie = () => {
    
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    let Data ={
      availabilitieId : availabilitieId,
      availabilitieStart : availabilitieStart,
      availabilitieEnd : availabilitieEnd,
      availabilitieCreatedAt : availabilitieCreatedAt,
    };

    fetch(variables.ApiUrl+'availabilitie',
      {
      method:'POST',
      headers:headers,
      body: JSON.stringify(Data) //convert data to JSON
    })
    // .then(res => res.text()) //if json format not useful
    .then(res => res.json())
    .then(
      (response)=>{
        alert(response)
        refreshAvailabilitie()
      },
      (error) => {
        //console.log("error connexion to the server")
        alert(error)
      }
    )
  }

  // delete availabilitie
  const deleteAvailabilitie = (id) => {
    if (window.confirm('Confirmation ')){
      let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      fetch(variables.ApiUrl+'availabilitie'+id,
        {
        method:'DELETE',
        headers:headers
        }
      )
      // .then(res => res.text()) //if json format not useful
      .then(res => res.json())
      .then(
        (response)=>{
          alert(response)
          refreshAvailabilitie()
        },
        (error) => {
          //console.log("error connexion to the server")
          alert(error)
        }
      )
    }
  }


  //view slot
  const showSlot = () => setSlot(true)
  const CloseSlot = () => setSlot(false)
  //create slot
  const showAddSlot = () => setAddSlot(true)
  const CloseAddSlot = () => setAddSlot(false)

  const showReservation = () => setReservation(true)
  const CloseReservation = () => setReservation(false)

  //create slot
  const CreateSlot = () => {
    setSlotsData([
      ...slotsData,
      {
        start,
        end
      }
    ]);
    //close modal
    CloseAddSlot()
    //we can now create reservation
    setIsSlotAvailable(true)
  }

  // create new reservation
  const CreateReservation = () => {
    //verify if the reservation time exist in the slot time 
    let msg=""
    for (let i=1; i < slotsData.length; i++){
      if(start >= slotsData[i].start  && start < slotsData[i].end  && end <= slotsData[i].end && end > slotsData[i].start ){
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
      }else{
        alert('slot not available')
      }

        // to do: try this switch
      // switch(slotsData){
      //   case (start >= slotsData[i].start):
      //   case (start < slotsData[i].end) :
      //   case (end <= slotsData[i].end):
      //   case (end > slotsData[i].start):
      //     setReservationsData([...reservationsData,{title,start,end}]);
      //     //close modal 
      //     CloseReservation();
      //     break;
      //   default:
      //     alert('slot not available')
      // }

    }
    
  }
  
  return (
    <>
    <div className="App">
      <Button variant="primary" onClick={showAddSlot} >
              Add  slot
      </Button>
      <Button variant="primary" onClick={showSlot} >
             Viw slots
      </Button>
      {
      isSlotAvailable &&
      <Button variant="primary" onClick={showReservation} >
              Create reservation
      </Button>
    }
      {/* view slots */}
      <Modal show={slot} fullscreen={true} onHide={CloseSlot}>
        <Modal.Header closeButton>
          <Modal.Title>Available Slots</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Calendar
            // views={["day", "agenda", "work_week", "month"]}
            views={["day", "agenda", "work_week"]}
            // selectable
            localizer={localizer}
            // defaultDate={new Date()}
            defaultView="day"
            events={slotsData}
            style={{ height: "100vh" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={CloseSlot}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* add slots */}
      <Modal show={addSlot} fullscreen={false} onHide={CloseAddSlot}>
        <Modal.Header closeButton>
          <Modal.Title>Create Slot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formTitle" >
                <Form.Label>Start Slot</Form.Label>
                <DatePicker 
                selected={start} 
                onChange={(date) => setStart(date)}
                showTimeSelect
                showMonthDropdown
                dateFormat="MM/d/yyyy h:mm aa"
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTitle" >
                <Form.Label>End Slot</Form.Label>
                <DatePicker 
                selected={end} 
                onChange={(date) => setEnd(date)}
                showTimeSelect
                showMonthDropdown
                dateFormat="MM/d/yyyy h:mm aa"
                />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={CloseAddSlot}>
            Cancel
          </Button>
          <Button variant="primary" onClick={CreateSlot}>
            Create
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={CloseReservation}>
            Cancel
          </Button>
          <Button variant="primary" onClick={CreateReservation}>
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
        style={{ height: "100vh" }}
      />

    </div>
  </>
  );
}
