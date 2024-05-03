// Profile.js
import React, { useState, useEffect } from 'react';
import { PatternFormat } from 'react-number-format';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext.js';
import Sidebar from '../components/Sidebar';
import { useProfile } from '../hooks/useProfile.jsx';
import './profile.css';

const Profile = () => {
    const [errorMessage, setErrorMessage] = useState();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const { user } = useAuthContext()
    const { profile, error } = useProfile()
    const [User, setUser] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        dob: ''
    });

    // States for if you are editing a specific field
    const [isEditing, setIsEditing] = useState({
        firstName: false,
        lastName: false,
        phone: false,
        address: false,
        dob: false
    });

    // Getting any profile if it already exists in the database
    const fetchUserProfile = async (email) => {
        try {
          const response = await axios.get(`http://localhost:3001/user/profile/${encodeURIComponent(email)}`);
          return response.data; // Assuming the response contains user profile data
        } catch (error) {
            throw error;
        }
    };

    // Fetch the user's existing data when the page loads
    useEffect(() => {
        const fetchExistingData = async () => {
            try {
                const existingUserData = await fetchUserProfile(user.email);
                setUser(existingUserData); // Update the User state with the fetched data
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        if (user) {
            fetchExistingData();
        }
    }, [user]);

    // Handling the change when you update the input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'dob') {
            const selectedDate = new Date(value);
            const today = new Date();

            if (selectedDate > today) {
                setErrorMessage("Date of Birth cannot be a future date.")
                setShowErrorMessage(true);
                setTimeout(() => {
                    setShowErrorMessage(false);
                  }, 5000);
                return;
            }
        }
        setUser({ ...User, [name]: value });
    };

    // Handle when you click the edit button, to set state to true
    const handleEditClick = (fieldName) => {
        setIsEditing({ ...isEditing, [fieldName]: true })
    }

    // Handle when you click the save button, to set state to false
    const handleSaveClick = async (fieldName) => {
        if (fieldName === 'phone') {

            // Remove non-numeric characters from the phone number
            const numericPhone = User.phone.replace(/\D/g, '');

            // Check if the phone number has exactly 10 characters
            if (numericPhone.length !== 10) {
                setErrorMessage("Phone number must be 10 characters long")
                setShowErrorMessage(true);
                setTimeout(() => {
                    setShowErrorMessage(false);
                  }, 5000);

                return;
            }
        }
        // Save the changes
        setIsEditing({ ...isEditing, [fieldName]: false });
    }
    // Formatting the dob to be display better
    function getFormattedBirthday(dob) {
        if (!dob) return '';
      
        const date = new Date(dob);
        const formatter = new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        });
      
        return formatter.format(date);
      }

    // Handling the update profile button to save changes to the database
    const handleSubmit = async (e) => {
        e.preventDefault()
        await profile(user.email, User.firstName, User.lastName, User.phone, User.address, User.dob)

        // Set showSuccessMessage to true
        setShowSuccessMessage(true);
  
        // Hide the success message after a few seconds
        setTimeout(() => {
        setShowSuccessMessage(false);
        }, 1500);
    }

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                {showErrorMessage && (
                    <div className="error-message">{errorMessage}</div>
                    )}
                {showSuccessMessage && (
                    <div className="success-message">You have updated your profile!</div>
                    )}
                    <div className='container'>
                        <div className='container-header'>
                            <div className='profile-header'>Profile</div>
                        </div>
                        <div className='profile-details'>
                            <div>{user.email}</div>
                        </div>
                        <div className='profile-details'>
                            {/* First Name */}
                            {!isEditing.firstName ? (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter your first name"
                                        value={User.firstName}
                                    />
                                    <button onClick={() => handleEditClick('firstName')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                            <path d="M12.293 1.293a1 1 0 0 1 1.414 0l1 1a1 1 0 0 1 0 1.414L2.293 15.95a1 1 0 0 1-.578.293H1a1 1 0 0 1-1-1v-.715a1 1 0 0 1 .293-.578l11.643-11.643a1 1 0 0 1 .578-.293z" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        className='profile-item'
                                        type='text'
                                        name='firstName'
                                        value={User.firstName}
                                        onChange={handleInputChange}
                                    />
                                    <button onClick={() => handleSaveClick('firstName')}>Save</button>
                                </div>
                            )}
                        </div>
                        <div className='profile-details'>
                            {/* Last Name */}
                            {!isEditing.lastName ? (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter your last name"
                                        value={User.lastName}
                                    />
                                    <button onClick={() => handleEditClick('lastName')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                            <path d="M12.293 1.293a1 1 0 0 1 1.414 0l1 1a1 1 0 0 1 0 1.414L2.293 15.95a1 1 0 0 1-.578.293H1a1 1 0 0 1-1-1v-.715a1 1 0 0 1 .293-.578l11.643-11.643a1 1 0 0 1 .578-.293z" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        className='profile-item'
                                        type='text'
                                        name='lastName'
                                        value={User.lastName}
                                        onChange={handleInputChange}
                                    />
                                    <button onClick={() => handleSaveClick('lastName')}>Save</button>
                                </div>
                            )}
                        </div>
                        <div className='profile-details'>
                            {/* Phone Number */}
                            {!isEditing.phone ? (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter your phone number"
                                        value={User.phone}
                                    />
                                    <button onClick={() => handleEditClick('phone')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                            <path d="M12.293 1.293a1 1 0 0 1 1.414 0l1 1a1 1 0 0 1 0 1.414L2.293 15.95a1 1 0 0 1-.578.293H1a1 1 0 0 1-1-1v-.715a1 1 0 0 1 .293-.578l11.643-11.643a1 1 0 0 1 .578-.293z" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <PatternFormat
                                        className='profile-item'
                                        name='phone'
                                        format="(###) ###-####"
                                        value={User.phone}
                                        onChange={handleInputChange}
                                    />
                                    <button onClick={() => handleSaveClick('phone')}>Save</button>
                                </div>
                            )}
                        </div>
                        <div className='profile-details'>
                            {/* Address */}
                            {!isEditing.address ? (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter your address"
                                        value={User.address}
                                    />
                                    <button onClick={() => handleEditClick('address')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                            <path d="M12.293 1.293a1 1 0 0 1 1.414 0l1 1a1 1 0 0 1 0 1.414L2.293 15.95a1 1 0 0 1-.578.293H1a1 1 0 0 1-1-1v-.715a1 1 0 0 1 .293-.578l11.643-11.643a1 1 0 0 1 .578-.293z" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        className='profile-item'
                                        type='text'
                                        name='address'
                                        value={User.address}
                                        onChange={handleInputChange}
                                    />
                                    <button onClick={() => handleSaveClick('address')}>Save</button>
                                </div>
                            )}
                        </div>
                        <div className='profile-details'>
                            {/* Date of Birth */}
                            {!isEditing.dob ? (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter your date of birth"
                                        value={getFormattedBirthday(User.dob)}
                                    />
                                    <button onClick={() => handleEditClick('dob')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                            <path d="M12.293 1.293a1 1 0 0 1 1.414 0l1 1a1 1 0 0 1 0 1.414L2.293 15.95a1 1 0 0 1-.578.293H1a1 1 0 0 1-1-1v-.715a1 1 0 0 1 .293-.578l11.643-11.643a1 1 0 0 1 .578-.293z" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        className='profile-item'
                                        type={isEditing.dob ? 'date' : 'text'}  // Use 'date' input type when editing, 'text' when not
                                        name='dob'
                                        value={User.dob}
                                        onChange={handleInputChange}
                                    />
                                    <button onClick={() => handleSaveClick('dob')}>Save</button>
                                </div>
                            )}
                        </div>
                        <div className='buttons'>
                        <div className='button-submit' onClick={handleSubmit}>
                            <button disabled={Object.values(isEditing).some((editing) => editing)}>Update Profile</button>
                        </div>
                        </div>
                    </div>
                    {error && <div className='error'>{error}</div>}
                </div>
            </div>
        </div>
    );
};

export default Profile;