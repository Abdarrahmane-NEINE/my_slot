import React, { useCallback, useState, useRef, buildMessage, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import events from "./events";

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
  const [slotList, setSlotList] = useState(false)
  const [addSlot, setAddSlot] = useState(false)
  const [isSlotAvailable, setIsSlotAvailable] = useState(false)

  const [reservation, setReservation] = useState(false)


  // availabilities's state
  const [availabilities, setAvailabilities] = useState([])
  
  // reservations's state
  const [reservations, setReservations] = useState([])
  const [reservationList, setReservationList] = useState(false)

  
  //get availabilitie stored in db
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
        setIsSlotAvailable(true)
        let i = 0
        for (i; i < response.length; i++){
          setAvailabilities(response)
          setSlotsData([
            ...slotsData,
            {
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
      (reservationData)=>{
        setReservations(reservationData);
        /* we should verify slot avilable befor crearinf a reservation */
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
          (slotData)=>{
            setIsSlotAvailable(true)
            let i = 0
            for (i; i < slotData.length; i++){
              for (let j=0; j < reservationData.length; j++){
                if(reservationData[j].Start >= slotData[i].Start  && reservationData[j].Start < slotData[i].End  && reservationData[j].End <= slotData[i].End && reservationData[j].End > slotData[i].Start ){
                  setReservationsData([
                    ...reservationsData,
                    {
                      title: reservationData[j].Title,
                      start: moment(reservationData[j].Start).toDate(),
                      end: moment(reservationData[j].End).toDate()
                    }
                  ]);
                }
              }
            }
          },
          (error) => {
            alert('error connexion to the server')
            // alert(error)
          }
        )

      },
      (error) => {
        // alert(error)
        alert('error connexion to the server')
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
          // alert(error)
          alert('error connexion to the server')
        }
      )
    }
  }

  //view slot Calendar
  const showSlot = () => {
    setSlot(true)
    // getAvailabilitie()
  } 
  const closeSlot = () => setSlot(false)
  //view slot list
  const showSlotList = () => {
    setSlotList(true)
    // getAvailabilitie()
  } 
  const closeSlotList = () => setSlotList(false)

  //create slot
  const showAddSlot = () => setAddSlot(true)
  const CloseAddSlot = () => setAddSlot(false)

  const showReservation = () => setReservation(true)
  const closeReservation = () => setReservation(false)
  const showReservationList = () => setReservationList(true)
  const closeReservationList = () => setReservationList(false)

  //create slot
  const CreateSlot = ({start, end}) => {
    const slotSelected = window.confirm('slot between ' +  moment(start).format("DD/MM/YYYY HH:MM") + ' and ' + moment(end).format("DD/MM/YYYY HH:MM"))
    if(slotSelected){
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
      .then(res => res.json())
      .then(
        (response)=>{
          getAvailabilitie()
          //we can now create reservation
          setIsSlotAvailable(true)
        },
        (error) => {
          alert("error connexion to the server")
          // alert(error)
        }
      )
    } 
  }

  // create new reservation
  const createReservation = ({start, end}) => {
    const reservationEmail = window.prompt('Add your email')
    const reservationTitle = window.prompt('Title of reservation')
    //check emil validation
    const CheckEmail = RegExp(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i);

    if ((reservationEmail.length==0) || (reservationTitle.length==0)){
      alert("Please fill the mendatory fields !!!");
    }else if (!(CheckEmail).test(reservationEmail)){
      alert("email invalid !!!");
    }else{
      let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      let Data ={
        Title : reservationTitle,
        Email : reservationEmail,
        Start : moment(start).toDate(),
        End : moment(end).toDate()
      };
  
      fetch(variables.ApiUrl+'reservation',
        {
        method:'POST',
        headers:headers,
        body: JSON.stringify(Data) //convert data to JSON
      })
      .then(res => res.json())
      .then(
        (response)=>{       
          //update reservation's list
          getReservation()
          //close modal
          closeReservation()
  
        },
        (error) => {
          console.log("error in the server")
          // alert(error)
        }
      )
    }
    
  }
  return (
    <>
    <div className="App">
      {/* <Button variant="primary" onClick={showReservation} >
        Reservation
      </Button> */}
      <Button variant="primary" onClick={showReservationList} >
        Reservation's list
      </Button>
      <Button variant="primary" onClick={showSlot} >
        Calendar of available slot
      </Button>
      <Button variant="primary" onClick={showSlotList} >
        List of available slot
      </Button>

      {/* retreive list available slot */}
      <Modal show={slotList} fullscreen={true} onHide={closeSlotList}>
        <Modal.Header>
          <Modal.Title>Available Slots</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                          <td>{moment(availabilitie.Start).format("DD/MM/YYYY HH:MM")}</td>
                          <td>{moment(availabilitie.End).format("DD/MM/YYYY HH:MM")}</td>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeSlotList}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* retreive list reservation  */}
      <Modal show={reservationList} fullscreen={true} onHide={closeReservationList}>
        <Modal.Header closeButton>
          <Modal.Title>Available Slots</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
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
                          <td>{moment(reservation.Start).format("DD/MM/YYYY HH:MM")}</td>
                          <td>{moment(reservation.End).format("DD/MM/YYYY HH:MM")}</td>
                          <td>{moment(reservation.CreatedAt).format("DD/MM/YYYY HH:MM")}</td>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeReservationList}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* view slots */}
      <Modal show={slot} fullscreen={true} onHide={closeSlot}>
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
          <Button variant="secondary" onClick={closeSlot}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* show reservation */}
      {/* <Modal show={reservation} fullscreen={true} onHide={closeReservation}>
        <Modal.Header closeButton>
          <Modal.Title>Add reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Calendar
            // views={["day", "agenda", "work_week", "month"]}
            views={["day", "agenda", "work_week"]}
            selectable
            localizer={localizer}
            // defaultDate={new Date()}
            defaultView="day"
            events={reservationsData}
            onSelectSlot={createReservation}
            // {...reservations.map((reservation) => {
            //   events={
            //     start: reservation.Start,
            //     end: reservation.End
            //   }
            //   }) 
            // }
            style={{ height: "100vh" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeReservation}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal> */}

      <Calendar
        // views={["day", "agenda", "work_week", "month"]}
        views={["day", "agenda", "work_week"]}
        selectable
        localizer={localizer}
        // defaultDate={new Date()}
        defaultView="day"
        events={reservationsData}
        onSelectSlot={createReservation}
        style={{ height: "100vh" }}
      />

    </div>
  </>
  );
}
