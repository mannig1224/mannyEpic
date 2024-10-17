import React from 'react';
import styles from './Modal.module.css'; // Create a Modal.module.css for styling

// Define Props type to include 'children' and 'onClose'
interface ModalProps {
  onClose: () => void;
  children: React.ReactNode; // Add children prop type
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
