import React, { useCallback, useState, useRef, buildMessage, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import events from "./events";

import "react-big-calendar/lib/css/react-big-calendar.css";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import showAlert from '../utils/customAlert'
import DatePicker from 'react-datepicker'

import { getUniqueReservation, getUniqueSlots } from "../utils/dataProcessing";
import CustomModal from "./CustomModal";
import { confirmDeletion, confirmSlot } from "../common/confirmation";

import { variables } from "../utils/variablesApi";
moment.locale("en-GB");
const localizer = momentLocalizer(moment);

export default function ReactBigCalendar() {

  //reservationsData => contain only valid reservation (reservation that correspond to an availability)
  const [validReservation, setValidReservation] = useState(events);
  // slot data to be showed on calendar
  const [slotsData, setSlotsData] = useState([])

  const [slot, setSlot] = useState(false)
  const [showSlotList, setShowSlotList] = useState(false)
  const [addSlot, setAddSlot] = useState(false)
  const [isSlotAvailable, setIsSlotAvailable] = useState(false)

  const [reservation, setReservation] = useState(false)
  const [activeTab, setActiveTab] = useState("reservation");

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    onConfirm: null,
  });
  const [isModalEmailVerificationVisible, setisModalEmailVerificationVisible] = useState(false)
  const [emailValidationData, setEmailValidationData] = useState(null)
  const [userEmailInput, setUserEmailInput] = useState("")
  // list of available slot 
  const [availabilities, setAvailabilities] = useState([])

  // reservations = contain all reservation.
  const [reservations, setReservations] = useState([])
  const [showReservationList, setShowReservationList] = useState(false)
  // all events
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    getReservation();
    getAvailabilitie();
  }, []);
  useEffect(() => {
    const availableEvents = availabilities.map(slot => ({
      title: 'Available Slot',
      start: new Date(slot.Start),
      end: new Date(slot.End),
    }));
    
    setAllEvents([...validReservation, ...availableEvents]);
  }, [validReservation, availabilities]);
  
  // check if the selected slot overlaps with any available slot
  const isValidSlot = (start, end) => {
    const isValidReservation = availabilities.some(slot => {
      const slotStart = new Date(slot.Start)
      const slotEnd = new Date(slot.End)

      return start >= slotStart && end <= slotEnd
    });
    return isValidReservation
  };
  const handleSelectSlot = ({ start, end }) => {
    if (isValidSlot(start, end)) {
      createReservation({ start, end })
    } else {
      showAlert({
        title: 'info',
        text: 'slot not available. Please select an available slot',
        icon: 'info',
        confirmButtonText: 'ok',
        showConfirmButton: true,
        showCancelButton: false
      })
    }
  };

  //get availabilitie stored in db
  const getAvailabilitie = () => {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    fetch(variables.ApiUrl + 'availabilitie',
      {
        method: 'GET',
        headers: headers,
      }
    )
      .then(res => res.json())
      .then(
        (slotData) => {
          setIsSlotAvailable(true)
          setAvailabilities(slotData)
          // update setSlotsData one time
          setSlotsData(prevSlots => getUniqueSlots(prevSlots, slotData))
        },
        (error) => {
          showAlert({
            title: 'error',
            text: 'error connexion to the server',
            icon: 'error',
            confirmButtonText: 'ok',
            showConfirmButton: true,
            showCancelButton: false
          })
        }
      )

  }
  // fetch all reservation but on calendar show only thos match an available slot
  const getReservation = () => {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    fetch(variables.ApiUrl + 'reservation',
      {
        method: 'GET',
        headers: headers,
      }
    )
      .then(res => res.json())
      .then(
        (reservationData) => {
          setReservations(reservationData);
          /* we should verify slot avilable befor showing a reservation on the calendar*/
          let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          };

          fetch(variables.ApiUrl + 'availabilitie',
            {
              method: 'GET',
              headers: headers,
            }
          )
            .then(res => res.json())
            .then(
              (slotData) => {
                setIsSlotAvailable(true)
                setSlotsData(prevSlots => getUniqueSlots(prevSlots, slotData))
                setValidReservation(prevReservation => getUniqueReservation(prevReservation, reservationData, slotData))
              },
              (error) => {
                showAlert({
                  title: 'error',
                  text: 'error connexion to the server',
                  icon: 'error',
                  confirmButtonText: 'ok',
                  showConfirmButton: true,
                  showCancelButton: false
                })
              }
            )

        },
        (error) => {
          showAlert({
            title: 'error',
            text: 'error connexion to the server',
            icon: 'error',
            confirmButtonText: 'ok',
            showConfirmButton: true,
            showCancelButton: false
          })
        }
      )

  }

  // handle email input change
  const handleEmailChange = (e) => {
    setUserEmailInput(e.target.value);
  };
  const handleDeleteClick = (id, emailReservation) => {
    setEmailValidationData({ id, emailReservation })
    setisModalEmailVerificationVisible(true)
  };
  // handle email form submission
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    //verfy reservation email 
    if (emailValidationData && userEmailInput === emailValidationData.emailReservation) {
      deleteReservation(emailValidationData.id)
    } else {
      showAlert({
        title: 'info',
        text: 'Email invalid',
        icon: 'info',
        confirmButtonText: 'ok',
        showConfirmButton: true,
        showCancelButton: false
      })
    }
  }

  //delete reservation
  const deleteReservation = (id) => {
    //send email with reservation id
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    fetch(variables.ApiUrl + 'reservation/' + id,
      {
        method: 'DELETE',
        headers: headers,
      }
    )
      .then(res => res.text())
      .then(
        (response) => {
          setValidReservation((prevValidReservation) => prevValidReservation.filter(
            (reservation) => reservation.id !== id
          ));
          setReservations((prevReservation) => prevReservation.filter(
            (reservation) => reservation.Id !== id
          ));

          setUserEmailInput("")
          setEmailValidationData(null)
          setisModalEmailVerificationVisible(false)
          showAlert({
            title: 'success',
            text: 'The reservation has been deleted successfully.',
            icon: 'success',
            confirmButtonText: 'ok',
            showConfirmButton: true,
            showCancelButton: false
          })
        },
        (error) => {
          showAlert({
            title: 'error',
            text: 'Error, verify you email and try again',
            icon: 'error',
            confirmButtonText: 'ok',
            showConfirmButton: true,
            showCancelButton: false
          })
        }
      )

  }

  const deleteAvailabilitie = async (id) => {
    const isConfirmed = await confirmDeletion();

    if (isConfirmed) {
      // Proceed with deletion
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      fetch(variables.ApiUrl + "availabilitie/" + id, {
        method: "DELETE",
        headers,
      })
        .then((res) => res.text())
        .then(
          (response) => {
            // remove item from availabilities
            setAvailabilities((prevAvailability) => prevAvailability.filter(
              (availability) => availability.Id !== id)
            ); 
            // remove item from slot calendar
            setSlotsData((prevSlot) => prevSlot.filter(
              (availability) => availability.id !== id)
            ); 
          },
          (error) => {
            showAlert({
              title: 'error',
              text: 'error connexion to the server',
              icon: 'error',
              confirmButtonText: 'ok',
              showConfirmButton: true,
              showCancelButton: false
            })
          }
        );
    }
  };

  const closeEmailVerificationModal = () => {
    setisModalEmailVerificationVisible(false)
    setUserEmailInput("")
    setEmailValidationData(null)
  };
  //view slot Calendar
  const showSlot = () => {
    setSlot(true)
    getAvailabilitie()
  }
  const closeSlot = () => setSlot(false)
  //view slot list
  const handleShowSlotList = () => {
    setShowSlotList(true)
    getAvailabilitie()
  }
  const closeSlotList = () => setShowSlotList(false)

  //create slot
  const showAddSlot = () => setAddSlot(true)
  const CloseAddSlot = () => setAddSlot(false)

  const showReservation = () => setReservation(true)
  const closeReservation = () => setReservation(false)
  const handleShowReservationList = () => {
    setShowReservationList(true)
    getReservation()
  }
  const closeReservationList = () => setShowReservationList(false)

  //create slot
  const CreateSlot = async ({ start, end }) => {
    const isSlotConfirmed = await confirmSlot(start, end)
    if (isSlotConfirmed) {
      let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      let Data = {
        Start: moment(start).toDate(),
        End: moment(end).toDate()
      };

      fetch(variables.ApiUrl + 'availabilitie',
        {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(Data) //convert data to JSON
        })
        .then(res => res.json())
        .then(
          (response) => {
            getAvailabilitie()
            //we can now create reservation
            setIsSlotAvailable(true)
          },
          (error) => {
            showAlert({
              title: 'error',
              text: 'error connexion to the server',
              icon: 'error',
              confirmButtonText: 'ok',
              showConfirmButton: true,
              showCancelButton: false
            })
          }
        )
    }
  }

  // create new reservation
  const createReservation = ({ start, end }) => {
    const reservationEmail = window.prompt('Add your email')
    const reservationTitle = window.prompt('Title of reservation')
    //check emil validation
    const CheckEmail = RegExp(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i);

    if ((reservationEmail.length == 0) || (reservationTitle.length == 0)) {
      showAlert({
        title: 'info',
        text: 'Please fill the mendatory fields !!!',
        icon: 'info',
        confirmButtonText: 'ok',
        showConfirmButton: true,
        showCancelButton: false
      })
    } else if (!(CheckEmail).test(reservationEmail)) {
      showAlert({
        title: 'info',
        text: 'mail invalid !!!',
        icon: 'info',
        confirmButtonText: 'ok',
        showConfirmButton: true,
        showCancelButton: false
      })
    } else {
      let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      let Data = {
        Title: reservationTitle,
        Email: reservationEmail,
        Start: moment(start).toDate(),
        End: moment(end).toDate()
      };

      fetch(variables.ApiUrl + 'reservation',
        {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(Data) //convert data to JSON
        })
        .then(res => res.json())
        .then(
          (response) => {
            //update View Reservations List
            getReservation()
            //close modal
            closeReservation()

          },
          (error) => {
            showAlert({
              title: 'error',
              text: 'error in the server',
              icon: 'error',
              confirmButtonText: 'ok',
              showConfirmButton: true,
              showCancelButton: false
            })
          }
        )
    }

  }
  return (
    <>
      <div className="App">
        {/* menu of button */}
        <div className="custom-container">
          <div className="custom-row">
            <div className="custom-col">
              <button className="custom-button custom-button-primary active">
                Reservation Calendar
              </button>
            </div>
            <div className="custom-col">
              <button
                className="custom-button custom-button-success"
                onClick={() => {
                  handleShowReservationList();
                }}
              >
                Reservations List
              </button>
            </div>
            <div className="custom-col">
              <button
                className="custom-button custom-button-warning"
                onClick={() => {
                  showSlot();
                }}
              >
                Availability Calendar
              </button>
            </div>
            <div className="custom-col">
              <button
                className="custom-button custom-button-info"
                onClick={() => {
                  handleShowSlotList();
                }}
              >
                Availabilities List
              </button>
            </div>
          </div>
        </div>
        {/* retreive list available slot */}
        <Modal show={showSlotList} fullscreen={true} onHide={closeSlotList}>
          <Modal.Header closeButton>
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
                  {availabilities.map((availabilitie, k) =>
                    <tr key={k}>
                      <td>{availabilitie.Id}</td>
                      <td>{moment(availabilitie.Start).format("DD/MM/YYYY HH:MM")}</td>
                      <td>{moment(availabilitie.End).format("DD/MM/YYYY HH:MM")}</td>
                      <td>
                        <button type="button"
                          className="btn btn-light mr-1"
                          onClick={() => deleteAvailabilitie(availabilitie.Id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
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
        <Modal show={showReservationList} fullscreen={true} onHide={closeReservationList} >
          <Modal.Header closeButton>
            <Modal.Title>Reservation list</Modal.Title>
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
                  {reservations.map((reservation, k) =>
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
                          onClick={() => handleDeleteClick(reservation.Id, reservation.Email)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
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
            <Modal.Title>View Calendar of Available Slots</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="calendar-container">
              <h2 className="calendar-title">Availabilitie Calendar</h2>
              <Calendar
                // views={["day", "agenda", "work_week", "month"]}
                views={["day", "work_week", "month"]}
                selectable
                localizer={localizer}
                // defaultDate={new Date()}
                defaultView="day"
                events={slotsData}
                onSelectSlot={CreateSlot}
                style={{ height: "100vh" }}
                min={new Date(1972, 1, 1, 8, 0, 0)}
                max={new Date(1972, 1, 1, 23, 0, 0)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeSlot}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="calendar-container">
          <h2 >Reservation Calendar</h2>
          <Calendar
            // views={["day", "agenda", "work_week", "month"]}
            views={["day", "agenda", "work_week"]}
            selectable
            localizer={localizer}
            // defaultDate={new Date()}
            defaultView="day"
            events={allEvents}
            eventPropGetter={(event) => {
              if (event.title === 'Available Slot') {
                return { style: { backgroundColor: '#d4edda', color: '#155724' } };
              }
              return {};
            }}
            onSelectSlot={handleSelectSlot}
            style={{ height: "100vh" }}
            min={new Date(1972, 1, 1, 8, 0, 0)}
            max={new Date(1972, 1, 1, 23, 0, 0)}
          />
        </div>
        
        {/* modal to confirm reservation delete */}
        <Modal show={isModalEmailVerificationVisible} onHide={closeEmailVerificationModal}>
          <Modal.Header closeButton>
            <Modal.Title>Email Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEmailSubmit}>
              <Form.Group controlId="emailInput">
                <Form.Label>Enter your email to confirm deletion:</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={userEmailInput}
                  onChange={handleEmailChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-3">
                Confirm
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEmailVerificationModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        <CustomModal
          show={confirmModal.show}
          title="Confirm Deletion"
          body="Are you sure you want to delete this reservation?"
          onClose={() => setConfirmModal({ show: false, onConfirm: null })}
          onConfirm={confirmModal.onConfirm}
        />
      </div>
    </>
  );
}
