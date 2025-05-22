import React, { useState, useEffect } from 'react';
import { FaCheck, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { clearAlert } from '../../slices/uiSlice';
import '../../styles/Alert.css';

const Alert = () => {
  const { alert } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (alert) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          dispatch(clearAlert());
        }, 300); // Wait for animation to complete
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [alert, dispatch]);

  if (!alert) return null;

  const getIcon = () => {
    switch (alert.type) {
      case 'success':
        return <FaCheck />;
      case 'error':
        return <FaExclamationTriangle />;
      case 'info':
        return <FaInfoCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      default:
        return <FaInfoCircle />;
    }
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      dispatch(clearAlert());
    }, 300);
  };

  return (
    <div className={`alert alert-${alert.type} ${visible ? 'alert-show' : 'alert-hide'}`}>
      <div className="alert-icon">{getIcon()}</div>
      <div className="alert-content">{alert.message}</div>
      <button className="alert-close" onClick={handleClose}>
        <FaTimes />
      </button>
    </div>
  );
};

export default Alert; 