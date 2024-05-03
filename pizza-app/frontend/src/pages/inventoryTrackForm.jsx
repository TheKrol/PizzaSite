import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import './inventoryTrackForm.css';

const InventoryTrackForm = () => {
    const { id } = useParams();
    const [inventoryTrack, setInventoryTrack] = useState({
        shift: '',
        date: '',
        name: '',
        quantity: '',
        status: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessageInv, setErrorMessageInv] = useState('');
    const [successMessageInv, setSuccessMessageInv] = useState('');
    const [inventoryData, setInventoryData] = useState([]);
    const navigate = useNavigate();

    //Fetch the inventory which will be used to display item selection and update quantity later on
    //Input: API request
    //Output: JSON response array of objects sorted alphabetically by item name
    const fetchAndSortInventory = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/inventory`);
            const sortedInventoryData = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setInventoryData(sortedInventoryData);
        } catch (error) {
            console.error('Error fetching and sorting inventory:', error);
        }
    };

    //Makes use of the fetchAndSortInventory() function when page loads.
    //Input: fetchAndSortInventory() function
    //Ouput: Inventory list display
    useEffect(() => {
        fetchAndSortInventory();
    }, []);

    //Fetch the tracking table and its contents
    //Input: Axios get request
    //Output: Tracking table contents or error if it cannot access the table
    useEffect(() => {
        const fetchTracking = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/tracking/${id}`);
                const data = res.data;
                setInventoryTrack(data);
            } catch (error) {
                console.error('Error fetching records:', error);
            }
        };

        if (id) {
            fetchTracking();
        }
    }, [id]);

    //Dsiplays error messages if user selects incorrect/out of bounds data/info or if
    //input is correct it will be saved to process the form submission
    //Input: User input selection
    //Output: Error message or inventoryTrack set with the user's info
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'quantity') {
            const isValidQuantity = /^[0-9]{1,4}$/.test(value);
            if (!isValidQuantity) {
                // If the input is not a non-negative integer with up to 4 digits, do not update the state
                return;
            }
        }

        if (name === 'date') {
            const selectedDate = new Date(value);
            const currentDate = new Date();
            if (selectedDate > currentDate) {
                setErrorMessageInv('Please select a date in the past or the current date.');
                setTimeout(() => {
                    setErrorMessageInv('');
                }, 2000);
                return;
            }
            const formattedDate = value.replace('T', ' ');
            setInventoryTrack({
                ...inventoryTrack,
                [name]: formattedDate,
            });
             return;
        }
        
        setInventoryTrack({
            ...inventoryTrack,
            [name]: value,
        });
        if (name === 'date' && errorMessageInv) {
            setErrorMessageInv('');
        }
    };

    const handleSubmit = async () => {
        if (!inventoryTrack.date || !inventoryTrack.quantity) {
            setErrorMessageInv('Please fill in all required fields.');
            return;
        }
        setIsLoading(true);
        try {
            const newTrackingData = {
                shift: inventoryTrack.shift,
                date: inventoryTrack.date,
                name: inventoryTrack.name,
                quantity: inventoryTrack.quantity,
                status: inventoryTrack.status
            };
            
            const inventoryItemToUpdate = inventoryData.find(item => item.name === newTrackingData.name);
            console.log("Inv Item to Update:", inventoryItemToUpdate.quantity);
            if (inventoryItemToUpdate) {
                let updateInventory;
                if(newTrackingData.status === 'Added'){
                    updateInventory = parseInt(inventoryItemToUpdate.quantity, 10) + parseInt(newTrackingData.quantity, 10);
                }
                else if(newTrackingData.status === 'Used Up'){
                    updateInventory = parseInt(inventoryItemToUpdate.quantity, 10) - parseInt(newTrackingData.quantity, 10);
                    if (updateInventory < 0)
                    {
                        setErrorMessageInv('Inventory item quantity cannot be less than 0!');
                        setTimeout(() => {
                            setErrorMessageInv('');
                        }, 1500);
                        return;
                    }
                }
                else{
                    setErrorMessageInv('Error updating inventory!');
                    setTimeout(() => {
                        setErrorMessageInv('');
                    }, 1500);
                    return;
                }
                const updatedInventoryData = {
                    _id: inventoryItemToUpdate._id,
                    quantity: updateInventory,
                };
            
                await axios.put(`http://localhost:3001/inventory/${inventoryItemToUpdate._id}`, updatedInventoryData);
                await axios.post(`http://localhost:3001/tracking/`, newTrackingData);
            }
            setSuccessMessageInv('Tracking record added successfully!');
            setIsLoading(false);
            
            setTimeout(() => {
                navigate('/inventoryTrack');
            }, 2000);
            
        } catch (error) {
            setErrorMessageInv('Error adding tracking record!');
            setTimeout(() => {
                setErrorMessageInv('');
            }, 1500);
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ marginLeft: 'auto', marginRight: 'auto'}}>
                <div className='main-container'>
                    <div className='main-container-header'>Track Inventory Form</div>
                    <form onSubmit={handleSubmit}>
                        <div className='containter-for-inputs'>
                            <div className='cont-input'>
                                <select
                                    name='shift'
                                    value={inventoryTrack.shift}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Shift</option>
                                    <option value='Open'>Open</option>
                                    <option value='Closing'>Closing</option>
                                </select>
                            </div>
                            <div className='cont-input'>
                                <input
                                    type='datetime-local'
                                    name='date'
                                    value={inventoryTrack.date}
                                    onChange={handleInputChange}
                                    placeholder='Select Date and Time'
                                />
                            </div>
                            <div className='cont-input'>
                                <select
                                    name='name'
                                    value={inventoryTrack.name}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Inventory Item</option>
                                    {inventoryData.map((item, index) => (
                                        <option key={index} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='cont-input'>
                                <input
                                    type='number'
                                    min='0'
                                    max='9999'
                                    name='quantity'
                                    placeholder='Input Quantity'
                                    value={inventoryTrack.quantity}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className='cont-input'>
                                <select
                                    name='status'
                                    value={inventoryTrack.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Status</option>
                                    <option value='Added'>Added</option>
                                    <option value='Used Up'>Used Up</option>
                                </select>
                            </div>
                        </div>
                        {successMessageInv && <p className='success-message-track-form'>{successMessageInv}</p>}
                        {errorMessageInv && <p className='error-message-track-form'>{errorMessageInv}</p>}
                        <div className='form-save' onClick={handleSubmit}>
                            <button disabled={isLoading}>Save</button>
                        </div>
                        <div className='form-save' onClick={() => navigate("../inventoryTrack")}>
                            <button disabled={isLoading}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default InventoryTrackForm;