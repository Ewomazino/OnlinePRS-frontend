// src/components/Modal.js
import React from 'react';
import '../css/Modal.css';

const Modal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>×</button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Modal;