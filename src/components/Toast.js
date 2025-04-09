import React, { useEffect } from "react";
import "../css/Toast.css"; // Create this CSS file for toast styling

const Toast = ({ message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  if (!message) return null;
  
  return (
    <div className="toast">
      {message}
    </div>
  );
};

export default Toast;