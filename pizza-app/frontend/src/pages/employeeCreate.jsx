import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './employee.css';
import { PatternFormat } from 'react-number-format';

const EmployeeCreate = () => {
    // State to manage the employee data and loading state
    const [Employee, setEmployee] = useState({
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

    // State to manage password strength and error
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordError, setPasswordError] = useState('');

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

        if (name === 'hRate' && (parseFloat(value) < 1 || parseFloat(value) > 1000)) {
            return;
        }

        // Update the employee state
        setEmployee({ ...Employee, [name]: name === 'phone' ? value.replace(/\D/g, '') : value });
    };

    // API endpoint for employee data
    const apiUrl = 'http://localhost:3001/employees';

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any input is missing
        const isMissingInput = Object.values(Employee).some(value => value === '');
        if (isMissingInput) {
            alert('Please input all information.');
            return;
        }

        setIsLoading(true);

        // Check if the email already exists
        const response = await axios.get(apiUrl);
        const employees = response.data;
        const isDuplicate = employees.some(emp => emp.email === Employee.email);
        if (isDuplicate) {
            alert('Employee with the same email already exists. Please provide a unique email.');
            setIsLoading(false);
            return;
        }

        try {
            // Make a POST request to create a new employee
            await axios.post(apiUrl, Employee);
            alert('Employee created successfully.');
            // Reset the form and loading state
            setEmployee({
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
            setIsLoading(false);
        } catch (error) {
            console.error('Error creating Employee:', error);
            setIsLoading(false);
        }
    };

    // Validate password strength
    const validatePassword = (password) => {
        // Define your password strength criteria here
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);

        // Calculate the strength based on criteria
        let strength = 0;
        if (password.length >= minLength) strength += 1;
        if (hasUppercase) strength += 1;
        if (hasLowercase) strength += 1;
        if (hasNumber) strength += 1;
        if (hasSpecialChar) strength += 1;

        // Interpret the strength level
        if (strength === 0) return 'Weak';
        if (strength === 1) return 'Moderate';
        if (strength >= 3) return 'Strong';

        return 'Weak'; // Default to Weak
    };

    // Handle password input changes
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        // Update the employee state with the new password
        setEmployee((prevEmployee) => ({
            ...prevEmployee,
            password: newPassword,
        }));

        // Check password strength
        const strength = validatePassword(newPassword);
        setPasswordStrength(strength);

        // Check if the password meets the criteria
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

            {/* Employee creation form */}
            <div className='employee-square'>
                <div className='login-header'>Employee Account Create</div>
                <form onSubmit={handleSubmit}>
                    {/* First Name input */}
                    <div className='form-login-employee'>
                        <div className='form-field-employee'>
                            <input
                                className='form-input-employee'
                                type='text'
                                required
                                name='firstName'
                                value={Employee.firstName}
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
                                required
                                name='lastName'
                                value={Employee.lastName}
                                onChange={handleInputChange}
                                placeholder='Last Name'
                            />
                        </div>
                    </div>

                    {/* Role selection */}
                    <div className='form-login-employee'>
                        <div className='form-field-employee'>
                            <label htmlFor="role"></label>
                            <select
                                id="role"
                                name='role'
                                value={Employee.role}
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
                                value={Employee.phone}
                                onChange={handleInputChange}
                                placeholder='Phone'
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
                                value={Employee.address}
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
                                value={Employee.dob}
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
                                required
                                name='hRate'
                                value={Employee.hRate}
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
                                required
                                value={Employee.email}
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
                                required
                                value={Employee.password}
                                onChange={handlePasswordChange}
                                placeholder='Password'
                            />
                        </div>
                    </div>

                    {/* Display password strength */}
                    <div className='passwordC-strength'>
                        Password Strength: {passwordStrength}
                    </div>

                    {/* Display password error if any */}
                    {passwordError && (
                        <div className='password-error'>
                            {passwordError}
                        </div>
                    )}

                    {/* Employee creation button */}
                    <div className='employee-button' onClick={handleSubmit}>
                        <button disabled={isLoading}>Add Employee</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeCreate;
