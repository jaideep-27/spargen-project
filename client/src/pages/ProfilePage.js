import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../slices/authSlice';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaKey } from 'react-icons/fa';
import Loader from '../components/ui/Loader';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo, loading } = useSelector((state) => state.auth);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Address states
  const [addressId, setAddressId] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Messages
  const [message, setMessage] = useState(null);
  const [addressMessage, setAddressMessage] = useState(null);

  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.firstName || '');
      setLastName(userInfo.lastName || '');
      setEmail(userInfo.email || '');
      setPhone(userInfo.phone || '');
    }
  }, [userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Password validation
    if (password && password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    // Dispatch update profile
    const userData = {
      firstName,
      lastName,
      email,
      phone,
    };
    
    if (password) {
      userData.password = password;
    }
    
    dispatch(updateProfile(userData));
    setPassword('');
    setConfirmPassword('');
    setMessage('Profile updated successfully');
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    
    const addressData = {
      addressId: addressId || null,
      address: {
        street,
        city,
        state,
        zipCode,
        country,
        isDefault
      }
    };
    
    // If this is a new address and is marked as default,
    // store this explicitly to ensure it gets processed correctly
    if (!addressId && isDefault) {
      addressData.makeDefault = true;
    }
    
    dispatch(updateProfile(addressData));
    setAddressMessage('Address updated successfully');
    
    // Reset form
    setStreet('');
    setCity('');
    setState('');
    setZipCode('');
    setCountry('');
    setIsDefault(false);
    setAddressId('');
    setShowAddressForm(false);
  };

  const editAddress = (address) => {
    setAddressId(address._id);
    setStreet(address.street || '');
    setCity(address.city || '');
    setState(address.state || '');
    setZipCode(address.zipCode || '');
    setCountry(address.country || '');
    setIsDefault(address.isDefault || false);
    setShowAddressForm(true);
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="page-title">My Profile</h1>
        
        {loading && <Loader />}
        
        <div className="profile-container">
          <div className="profile-section personal-info">
            <h2>Personal Information</h2>
            
            {message && <div className="alert alert-info">{message}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <div className="input-icon-wrapper">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="neu-input"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="input-icon-wrapper">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="neu-input"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="neu-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <FaPhone className="input-icon" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="neu-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <FaKey className="input-icon" />
                  <input
                    type="password"
                    placeholder="New Password (leave blank to keep current)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="neu-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <FaKey className="input-icon" />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="neu-input"
                  />
                </div>
              </div>
              
              <button type="submit" className="neu-button neu-button-primary">
                Update Profile
              </button>
            </form>
          </div>
          
          <div className="profile-section addresses">
            <h2>My Addresses</h2>
            
            {addressMessage && <div className="alert alert-info">{addressMessage}</div>}
            
            {userInfo && userInfo.addresses && userInfo.addresses.length > 0 ? (
              <div className="address-list">
                {userInfo.addresses.map((address) => (
                  <div key={address._id} className="address-card neu-card">
                    {address.isDefault && <div className="default-badge">Default</div>}
                    <p className="address-line">{address.street}</p>
                    <p className="address-line">{address.city}, {address.state} {address.zipCode}</p>
                    <p className="address-line">{address.country}</p>
                    <button 
                      onClick={() => editAddress(address)}
                      className="neu-button neu-button-small"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No addresses found. Add a new address below.</p>
            )}
            
            {!showAddressForm ? (
              <button 
                onClick={() => setShowAddressForm(true)}
                className="neu-button neu-button-secondary"
              >
                Add New Address
              </button>
            ) : (
              <div className="address-form neu-card">
                <h3>{addressId ? 'Edit Address' : 'Add New Address'}</h3>
                <form onSubmit={handleAddressSubmit}>
                  <div className="form-group">
                    <div className="input-icon-wrapper">
                      <FaMapMarkerAlt className="input-icon" />
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="neu-input"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="neu-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="State/Province"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="neu-input"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="ZIP/Postal Code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="neu-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="neu-input"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                    />
                    <label htmlFor="isDefault">Set as default address</label>
                  </div>
                  
                  <div className="form-buttons">
                    <button type="submit" className="neu-button neu-button-primary">
                      {addressId ? 'Update Address' : 'Add Address'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowAddressForm(false);
                        setAddressId('');
                        setStreet('');
                        setCity('');
                        setState('');
                        setZipCode('');
                        setCountry('');
                        setIsDefault(false);
                      }}
                      className="neu-button"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 