import React from "react";
import "../styles/Modal.css"

const Modal = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null; // Se o modal não estiver aberto, não renderiza nada

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">{children}</div>
        <button className="modal-close" onClick={onClose}>✖</button>
      </div>
    </div>
  );
};

export default Modal;
