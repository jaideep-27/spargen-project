import React from 'react';
import '../../styles/Loader.css';

const Loader = ({ size = 'medium', center = true }) => {
  const loaderClass = `loader loader-${size} ${center ? 'loader-center' : ''}`;
  
  return (
    <div className={loaderClass}>
      <div className="loader-ring"></div>
    </div>
  );
};

export default Loader; 