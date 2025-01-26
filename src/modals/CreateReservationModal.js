import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import showAlert from '../utils/customAlert'

const CreateReservationModal = ({ show, onClose, onSubmit }) => {
  const [reservationEmail, setReservationEmail] = useState('');
  const [reservationTitle, setReservationTitle] = useState('');

  const handleSubmit = () => {
    if (reservationEmail && reservationTitle) {
      //check emil validation
      const CheckEmail = RegExp(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i);

      if (!(CheckEmail).test(reservationEmail)) {
        showAlert({
          title: 'info',
          text: 'mail invalid !!!',
          icon: 'info',
          confirmButtonText: 'ok',
          showConfirmButton: true,
          showCancelButton: false
        })
        return
      }
      onSubmit({ reservationEmail, reservationTitle });
      handleClose()
    } else {
      showAlert({
        title: 'info',
        text: 'Please fill the mendatory fields !!!',
        icon: 'info',
        confirmButtonText: 'ok',
        showConfirmButton: true,
        showCancelButton: false
      })
    }
  };
  const handleClose = () => {
    setReservationEmail('')
    setReservationTitle('')
    onClose()
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Reservation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formReservationEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={reservationEmail}
              onChange={(e) => setReservationEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formReservationTitle" className="mt-3">
            <Form.Label>Reservation Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a title"
              value={reservationTitle}
              onChange={(e) => setReservationTitle(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateReservationModal;
