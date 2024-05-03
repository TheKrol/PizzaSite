// Signup.js
import React, { useState } from 'react';
import './signup.css';
import PasswordPopup from '../components/PasswordPopup';
import Sidebar from '../components/Sidebar';
import { useSignup } from '../hooks/useSignup';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let role ='Customer';
  const { signup, error, isLoading } = useSignup();
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password, role);
  };

  const handlePasswordPopup = () => {
    setShowPasswordPopup(!showPasswordPopup);
  };


  return (
    <div className='Signup-page'>
        <Sidebar />
        {showPasswordPopup && <PasswordPopup onClose={handlePasswordPopup} />}
          <div className='page-signup-box'>
            <div className='signup-header'>Create Account</div>
              <div className='signup-form'>
                <div className='input-container'>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Email'
                  />
                </div>
                <div className='input-container'>
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    onClick={handlePasswordPopup} // Added onClick for the password input
                  />
                </div>
              </div>
              {error && <div className='error'>{error}</div>}
              <button className='button-submit' onClick={handleSubmit} disabled={isLoading}>Sign Up</button>
          </div>
        </div>
  );
}

export default Signup;
