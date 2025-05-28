import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail } from '../slices/authSlice';
import { setAlert } from '../slices/uiSlice';

const VerifyEmailPage = () => {
  const { verificationToken } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (verificationToken) {
      dispatch(verifyEmail(verificationToken));
    }
  }, [dispatch, verificationToken]);

  useEffect(() => {
    if (userInfo) {
      // If email verification is successful and userInfo is set (logged in)
      navigate('/'); // Redirect to homepage or dashboard
    } else if (error) {
      // If there was an error during verification
      dispatch(setAlert({ type: 'error', message: error }));
      navigate('/login'); // Redirect to login page
    }
  }, [userInfo, error, navigate, dispatch]);

  return (
    <div className="container mt-5">
      <h2>Verifying your email...</h2>
      {/* You can add a spinner or loading message here */}
    </div>
  );
};

export default VerifyEmailPage; 