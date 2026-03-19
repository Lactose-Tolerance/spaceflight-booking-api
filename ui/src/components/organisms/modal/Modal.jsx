import React from 'react';
import Button from '../../atoms/button/Button';
import './Modal.css';

const Modal = ({
  isOpen,
  variant = 'info', // 'info', 'primary', 'danger'
  title,
  children,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}) => {
  if (!isOpen) return null;

  // Determine button configurations based on the variant
  const renderButtons = () => {
    switch (variant) {
      case 'info':
        return (
          <Button variant="primary" onClick={onConfirm} className="modal-btn">
            {confirmText || 'OK'}
          </Button>
        );
      case 'primary':
        return (
          <>
            <Button variant="danger" onClick={onCancel} className="modal-btn">
              {cancelText || 'No'}
            </Button>
            <Button variant="primary" onClick={onConfirm} className="modal-btn">
              {confirmText || 'Yes'}
            </Button>
          </>
        );
      case 'danger':
        return (
          <>
            <Button variant="primary" onClick={onCancel} className="modal-btn">
              {cancelText || 'No'}
            </Button>
            <Button variant="danger" onClick={onConfirm} className="modal-btn">
              {confirmText || 'Yes, Delete'}
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      {/* Stop propagation so clicking inside the modal doesn't close it */}
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {title && (
          <div className="modal-header">
            <h3>{title}</h3>
          </div>
        )}
        
        <div className="modal-body">
          {children}
        </div>
        
        <div className="modal-footer">
          {renderButtons()}
        </div>

      </div>
    </div>
  );
};

export default Modal;