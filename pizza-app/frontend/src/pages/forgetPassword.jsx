import React, { useState } from 'react';
import axios from 'axios';  // Import axios for making HTTP requests
import './forgetPassword.css';
import Sidebar from '../components/Sidebar';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    // Handler function for email input changes
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    // Handler function for form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Email:', email);
        handleForgotPassword();
    };

    // Function to handle the password reset process
    const handleForgotPassword = async () => {
        try {
            // Check if the email exists in your database
            const response = await axios.post('http://localhost:3001/check-email', { email });

            if (response.data.emailExists) {
                // Email exists in the database, send the reset link
                await axios.post('http://localhost:3001/forgot-password', { email });
                console.log('Password reset link sent to your email.');
                setShowAlert(true);

                // Hide the alert after 5 seconds
                setTimeout(() => {
                    setShowAlert(false);
                }, 5000);
            } else {
                alert('Email not found in our records. Please enter a valid email.');
            }
        } catch (error) {
            console.error('An error occurred. Please try again.', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex' }}>
                {/* Sidebar for navigation */}
                <Sidebar />
                <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    {showAlert && (
                        // Alert for displaying success message
                        <div className='alert show'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
                                <path d="M4.5 6V5a3.5 3.5 0 0 1 7 0v1h1v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6h1.5zM2 6V5a4 4 0 0 1 8 0v1h1V5a5 5 0 0 0-10 0v1h1z" />
                            </svg>
                            Password reset link sent to your email.
                        </div>
                    )}
                    {/* Password reset form */}
                    <div className='password-reset-form'>
                        <div className='reset-form-title'>Forgot Password?</div>
                        <form onSubmit={handleSubmit}>
                            {/* Email input field */}
                            <div className='field-email'>
                                <div className='fill-out'>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder='Email'
                                        required
                                    />
                                </div>
                            </div>
                            {/* Button to send password reset email */}
                            <div className='pass-reset' onClick={handleSubmit}>
                                <button>Send Email</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;
