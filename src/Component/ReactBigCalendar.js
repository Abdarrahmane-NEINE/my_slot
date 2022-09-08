import React, { useCallback, useState, useRef, buildMessage, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import events from "./events";
import slots from "./slots";

import "react-big-calendar/lib/css/react-big-calendar.css";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

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

  // const [start, setStart]= useState(new Date.toJson())
  // const [end, setEnd]= useState(new Date.toJson())

  // availabilities's state
  const [availabilities, setAvailabilities] = useState([])
  const [availabilitieStart, setAvailabilitieStart] = useState(new Date)

  // reservations's state
  const [reservations, setReservations] = useState([])

  // useEffect = () => {
      //getAvailabilitie
  // }
  
  //get reservation stored in db
  const getAvailabilitie = () => {
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
        let i = 0
        for (i; i < response.length; i++){
          alert(moment(response[i].Start).utc().format('YYYY/MM/DD H:MM:SS'))
          setSlotsData([
            ...slotsData,
            {
              // start: start,
              // end: end
              start: moment(response[i].Start).toDate(),
              end: moment(response[i].End).toDate()
            }
          ]);
        }
      },
      (error) => {
        alert('error connexion to the server')
        // alert(error)
      }
    )
    
  }
  const getReservation = () => {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    fetch(variables.ApiUrl+'reservation',
      {
      method:'GET',
      headers:headers,
      }
    )
    .then(res=>res.json())
    .then(
      (response)=>{
        setReservations(response);
      },
      (error) => {
        alert(error)
      }
    )
    
  }
  
  //delete reservation
  const deleteReservation = (id, emailReservation) => {
    const userEmail = window.prompt('Add your email')
    //verfy reservation email 
    if(userEmail == emailReservation){
      //send email with reservation id
      let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
  
      fetch(variables.ApiUrl+'reservation/'+id,
        {
        method:'DELETE',
        headers:headers,
        }
      )
      .then(res=>res.text())
      .then(
        (response)=>{
          getReservation()
        },
        (error) => {
          alert("Error, verify you email and try again")
        }
      )
    }else{
      alert('Email invalid')
    }
  }
  // delete availabilitie
  const deleteAvailabilitie = (id) => {
    if(window.confirm('Confirme delete ')){
      let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
  
      fetch(variables.ApiUrl+'availabilitie/'+id,
        {
        method:'DELETE',
        headers:headers,
        }
      )
      .then(res=>res.text())
      .then(
        (response)=>{
          getAvailabilitie()
        },
        (error) => {
          alert(error)
        }
      )
    }
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
      Start : start,
      End : end
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
        getAvailabilitie()
        setIsSlotAvailable(true)
        CloseAddSlot()
      },
      (error) => {
        //console.log("error connexion to the server")
        alert(error)
      }
    )
  }
  //create reservation
  const createReservation = () => {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    let Data ={
      Title : title,
      Email : email,
      Start : start,
      End : end
    };

    fetch(variables.ApiUrl+'reservation',
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
        setReservationsData([
          ...reservationsData,
          {
            title,
            start,
            end
          }
        ]);
        //update reservation's list
        getReservation()
        //close modal
        CloseReservation()

      },
      (error) => {
        //console.log("error connexion to the server")
        alert(error)
      }
    )
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
  const CreateSlot = ({start, end}) => {

    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    let Data ={
      Start : moment(start).toDate(),
      End : moment(end).toDate()
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
        getAvailabilitie()
        //we can now create reservation
        setIsSlotAvailable(true)
        //close modal
        CloseSlot()
      },
      (error) => {
        alert("error connexion to the server")
        // alert(error)
      }
    )
  }

  // create new reservation
  const AddReservation = ({start, end}) => {
    // const reservationEmail = window.prompt('Add your email')
    // const reservationTitle = window.prompt('Title of reservation')
    //To do check emil validation
    ///
    //
    // if(reservationEmail && reservationTitle){

    // }

    //verify if the reservation time exist in the slot time 
    let msg=""
    for (let i=1; i < availabilities.length; i++){
      // alert(moment(availabilities[i].Start).utc().format('YYYY/MM/DD H:MM:SS'))
      alert(moment(start).utc().format('YYYY/MM/DD H:MM:SS'))
      setSlotsData([
        ...slotsData,
        {
          // start: start,
          // end: end
          start: moment(availabilities[i].Start).utc().format('YYYY/MM/DD H:MM:SS'),
          end: moment(availabilities[i].End).utc().format('YYYY/MM/DD H:MM:SS')
        }
      ]);
      // if(start >= availabilities[i].start  && start < availabilities[i].end  && end <= availabilities[i].end && end > availabilities[i].start ){
      //   setReservationsData([
      //     ...reservationsData,
      //     {
      //       title,
      //       start,
      //       end
      //     }
      //   ]);
      //   alert('slot available')
      //   //close modal
      //   CloseReservation()
      // }else{
      //   alert('slot not available')
      // }

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
      <Button variant="primary" onClick={AddReservation} >
              test fill rsv
      </Button>
      <Button variant="primary" onClick={showAddSlot} >
              Add  slot
      </Button>
      <Button variant="primary" onClick={showSlot} >
             Viw slots
      </Button>
      <Button variant="primary" onClick={getReservation} >
             get reservation list
      </Button>
      <Button variant="primary" onClick={getAvailabilitie} >
             get available slot
      </Button>

      {/* retreive available slot */}
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Start at</th>
              <th>End at</th>
            </tr>
          </thead>
            <tbody>
              {availabilities.map((availabilitie,k)=>
                  <tr key={k}>
                      <td>{availabilitie.Id}</td>
                      <td>{availabilitie.Start}</td>
                      <td>{availabilitie.End}</td>
                      <td>
                      <button type="button"
                      className="btn btn-light mr-1"
                      onClick={() => deleteAvailabilitie(availabilitie.Id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                          </svg>
                      </button>
                      </td>
                  </tr>
                  )}
          </tbody>
        </Table>
      </div>

      <div>
        {
        isSlotAvailable &&
        <Button variant="primary" onClick={showReservation} >
                Create reservation
        </Button>
        }
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Email</th>
              <th>Start at</th>
              <th>End at</th>
              <th>Creation date</th>
              <th>Delete</th>
            </tr>
          </thead>
            <tbody>
              {reservations.map((reservation,k)=>
                  <tr key={k}>
                      <td>{reservation.Id}</td>
                      <td>{reservation.Title}</td>
                      <td>{reservation.Email}</td>
                      <td>{reservation.Start}</td>
                      <td>{reservation.End}</td>
                      <td>{reservation.CreatedAt}</td>
                      <td>
                      <button type="button"
                      className="btn btn-light mr-1"
                      onClick={() => deleteReservation(reservation.Id, reservation.Email)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                          </svg>
                      </button>
                      </td>
                  </tr>
                  )}
          </tbody>
        </Table>
      </div>
      {/* view slots */}
      <Modal show={slot} fullscreen={true} onHide={CloseSlot}>
        <Modal.Header closeButton>
          <Modal.Title>Available Slots</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Calendar
            // views={["day", "agenda", "work_week", "month"]}
            views={["day", "work_week", "month"]}
            selectable
            localizer={localizer}
            // defaultDate={new Date()}
            defaultView="day"
            // events={availabilities}
            events={slotsData}
            onSelectSlot={CreateSlot}
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
          <Button variant="primary" onClick={createAvailabilitie}>
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
                dateFormat="MM/d/yyyy h:mm aa"
                />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={CloseReservation}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createReservation}>
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
        // {...reservations.map((reservation) => {
        //   events={
        //     start: reservation.Start,
        //     end: reservation.End
        //   }
        //   }) 
        // }
        style={{ height: "100vh" }}
      />


    </div>
  </>
  );
}
