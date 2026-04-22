import React, { FC, ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // Create a backdrop element for the greyed-out background
  const backdrop = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
      }}
      onClick={onClose} // Close the modal when the backdrop is clicked
    />
  );

  // The modal overlay for the content
  const modalOverlay = (
    <div 
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        background: '#fff',
        borderRadius: '5px',
        zIndex: 1001,
      }}
    >
      <button onClick={onClose} className='text-right'>X</button>
      {children}
      
    </div>
  );

  // Use a portal to render outside the main app root
  // You need a div with id="modal-root" in your index.html
  return (
    <>
      {ReactDOM.createPortal(
        backdrop,
        document.getElementById('modal-root')!
      )}
      {ReactDOM.createPortal(
        modalOverlay,
        document.getElementById('modal-root')!
      )}
    </>
  );
};

export default Modal;
