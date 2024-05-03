import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import './employeeEdit.css';
import { PatternFormat } from 'react-number-format';

const EmployeeEdit = () => {
    // Get employee ID from the URL parameters
    const { id } = useParams();

    // State to manage the edited employee data and loading state
    const [editedEmployee, setEditedEmployee] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        dob: '',
        hRate: '',
        email: '',
        password: '',
        role: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // Navigation hook for redirecting after submission
    const navigate = useNavigate();

    // State to manage password strength and error
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Fetch employee data when the component mounts
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                // Fetch the employee data from the API based on the ID
                const response = await axios.get(`http://localhost:3001/employees/${id}`);
                const data = response.data;

                // Format the date to be compatible with the date input field
                data.dob = new Date(data.dob).toISOString().split('T')[0];
                setEditedEmployee(data);
            } catch (error) {
                console.error('Error fetching Employee:', error);
            }
        };

        // Check if there's an ID in the URL, then fetch the employee data
        if (id) {
            fetchEmployee();
        }
    }, [id]);

    // Handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'dob') {
            // Check if the selected date is in the future
            const selectedDate = new Date(value);
            const today = new Date();

            if (selectedDate > today) {
                alert("Date of Birth cannot be a future date.");
                return;
            }
        }
        if (name === 'hRate' && (parseFloat(value) < 1 || parseFloat(value) > 10000)) {
            return;
        }

        // Update the edited employee state
        setEditedEmployee((prevEmployee) => ({
            ...prevEmployee,
            [name]: name === 'phone' ? value.replace(/\D/g, '') : value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Format the date to ISO format before sending the update request
            editedEmployee.dob = new Date(editedEmployee.dob).toISOString();

            // Make a PUT request to update the employee data
            await axios.put(`http://localhost:3001/employees/${id}`, editedEmployee);
            alert('Employee updated successfully:', editedEmployee);

            // Reset loading state and navigate back to the employee list
            setIsLoading(false);
            navigate('/Employee');
        } catch (error) {
            alert('Error updating Employee:', error);
            setIsLoading(false);
        }
    };

    // Function to format ISO date to YYYY-MM-DD
    const formatISODate = (isoDate) => {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;

        return `${year}-${month}-${day}`;
    };

    // Format edited employee's date of birth
    const formattedDob = formatISODate(editedEmployee.dob);

    // Function to validate password strength
    const validatePassword = (password) => {
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);

        let strength = 0;
        if (password.length >= minLength) strength += 1;
        if (hasUppercase) strength += 1;
        if (hasLowercase) strength += 1;
        if (hasNumber) strength += 1;
        if (hasSpecialChar) strength += 1;

        if (strength === 0) return 'Weak';
        if (strength === 1) return 'Moderate';
        if (strength >= 3) return 'Strong';

        return 'Weak'; // Default to Weak
    };

    // Handle password input changes
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;

        // Update the edited employee state with the new password
        setEditedEmployee((prevEmployee) => ({
            ...prevEmployee,
            password: newPassword,
        }));

        // Check password strength
        const strength = validatePassword(newPassword);
        setPasswordStrength(strength);

        // Check if password meets criteria
        if (strength === 'Weak') {
            setPasswordError('Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        } else {
            setPasswordError('');
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar component */}
            <Sidebar />

            {/* Employee edit form */}
            <div style={{ marginLeft: 'auto', height: 'auto', marginRight: 'auto' }}>
                <div className='employeeE-square'>
                    <div className='login-header'>Edit Employee</div>
                    <form onSubmit={handleSubmit}>

                        {/* First Name input */}
                        <div className='form-login-employee'>
                            <div className='form-field-employee'>
                                <input
                                    className='form-input-employee'
                                    type='text'
                                    name='firstName'
                                    value={editedEmployee.firstName}
                                    onChange={handleInputChange}
                                    placeholder='First Name'
                                />
                            </div>
                        </div>

                        {/* Last Name input */}
                        <div className='form-login-employee'>
                            <div className='form-field-employee'>
                                <input
                                    className='form-input-employee'
                                    type='text'
                                    name='lastName'
                                    value={editedEmployee.lastName}
                                    onChange={handleInputChange}
                                    placeholder='Last Name'
                                />
                            </div>
                        </div>

                        {/* Role selection */}
                        <div className='form-login-employee'>
                            <div className='form-field-employee'>
                                <label htmlFor="role">Role:</label>
                                <select
                                    id="role"
                                    name='role'
                                    value={editedEmployee.role}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Role</option>
                                    <option value="Owner">Owner</option>
                                    <option value="Employee">Employee</option>
                                    <option value="Manager">Manager</option>
                                </select>
                            </div>
                        </div>

                        {/* Phone number input with formatting */}
                        <div className='form-login-employee'>
                            <div className='form-field-employee'>
                                <PatternFormat
                                    name='phone'
                                    format="(###) ###-####"
                                    value={editedEmployee.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Address input */}
                        <div className='form-login-employee'>
                            <div className='form-field-employee'>
                                <input
                                    className='form-input-employee'
                                    type='text'
                                    name='address'
                                    value={editedEmployee.address}
                                    onChange={handleInputChange}
                                    placeholder='Address'
                                />
                            </div>
                        </div>

                        {/* Date of Birth input */}
                        <div className='form-login-employee'>
                            <div className='form-field-employee'>
                                <input
                                    className='form-input-employee'
                                    type='date'
                                    name='dob'
                                    value={formattedDob}
                                    onChange={handleInputChange}
                                    placeholder='Date of Birth'
                                />
                            </div>
                        </div>

                        {/* Hourly Rate input */}
                        <div className='form-login-employee'>
                            <div className='form-field-employee'>
                                <input
                                    className='form-input-employee'
                                    type='number'
                                    name='hRate'
                                    value={editedEmployee.hRate}
                                    onChange={handleInputChange}
                                    placeholder='Hourly Rate'
                                />
                            </div>
                        </div>

                        {/* Email input */}
                        <div className='form-login-employee'>
                            <div className='form-field-employee'>
                                <input
                                    className='form-input-employee'
                                    type='email'
                                    name='email'
                                    value={editedEmployee.email}
                                    onChange={handleInputChange}
                                    placeholder='Email'
                                />
                            </div>
                        </div>

                        {/* Password input with strength indicator */}
                        <div className='form-login-employee'>
                            <div className='form-field-employee'>
                                <input
                                    className='form-input-employee'
                                    type='password'
                                    name='password'
                                    value={editedEmployee.password}
                                    onChange={handlePasswordChange}
                                    placeholder='Password'
                                />
                            </div>
                        </div>

                        {/* Display password strength */}
                        <div>
                            <div className='password-strength'>
                                Password Strength: {passwordStrength}
                            </div>

                            {/* Display password error if any */}
                            {passwordError && (
                                <div className='password-error'>
                                    {passwordError}
                                </div>
                            )}
                        </div>

                        {/* Employee save button */}
                        <div className='employee-button' onClick={handleSubmit}>
                            <button disabled={isLoading}>Save</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployeeEdit;