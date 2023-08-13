import React from "react";
import "./DeleteConfirmationPopup.css";

const DeleteConfirmationPopup = ({ onCancel, onConfirm }) => {
  return (
    <div className="delete-popup">
      <p>Are you sure you want to delete this post?</p>
      <button onClick={onConfirm}>Delete</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default DeleteConfirmationPopup;
