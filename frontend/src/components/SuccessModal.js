import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function SuccessModal({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Sucesso!</Modal.Title>
      </Modal.Header>
      <Modal.Body>A ação foi realizada com sucesso.</Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SuccessModal;
