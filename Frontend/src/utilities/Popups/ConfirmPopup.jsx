import React from "react";
import "./ConfirmPopup.css";

const ConfirmPopup = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="popup-container2">
      <div className="popup-content">
        <p>{message}</p>
        <div className="button-group">
          <button className="confirm-button" onClick={onConfirm}>
            OK
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
