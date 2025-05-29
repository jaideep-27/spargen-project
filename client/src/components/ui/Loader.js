import React from 'react';
import '../../styles/Loader.css';

const Loader = ({ size = 'medium', center = true, isActive }) => {
  const loaderClass = `loader loader-${size} ${center ? 'loader-center' : ''} ${center && isActive ? 'active' : ''}`;
  
  // If it's a centered loader that is NOT active, it will be invisible due to CSS (opacity: 0, visibility: hidden).
  // The component will still render the div structure, but CSS handles visibility.
  // No need to return null from JS for the inactive centered case if CSS handles it.
  return (
    <div className={loaderClass}>
      <div className="loader-ring"></div>
    </div>
  );
};

export default Loader; 