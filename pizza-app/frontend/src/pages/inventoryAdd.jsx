import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import './inventoryAdd.css';

const InventoryAdd = () => {
    const { id } = useParams();
    const [inventoryAdd, setInventoryAdd] = useState({
        name: '',
        type: '',
        quantity: '',
        unitType: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessageInv, setErrorMessageInv] = useState('');
    const [successMessageInv, setSuccessMessageInv] = useState('');
    const [unitTypes, setUnitTypes] = useState([]);
    const navigate = useNavigate();

    //Fetch the inventory table and its contents when page loads
    //Input: Axios get request
    //Output: Inventory table contents or error if it cannot access the table
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/inventory/${id}`);
                const data = res.data;
                setInventoryAdd(data);
            } catch (error) {
                console.error('Error fetching inventory:', error);
            }
        };

        if (id) {
            fetchInventory();
        }
    }, [id]);

    //This allows for categories selected to display the appropiate unit types
    //pertaining to that category when it's triggered upon user selecting a category.
    //Input: The selected category type and the unit type selected by the user.
    //Output: Sets the unit type variable to whatever the user selected.
    useEffect(() => {
        const getUnitTypes = () => {
            switch (inventoryAdd.type) {
                case 'Drink':
                    setUnitTypes(['Bottles - 2L', 'Bottles - 20oz', 'Cans']);
                    break;
                case 'Ingredient':
                    setUnitTypes(['Bags', 'Jars', 'Ounces', 'Pounds']);
                    break;
                case 'Other':
                    setUnitTypes(['Bags', 'Boxes', 'Packs']);
                    break;
                case 'Side':
                    setUnitTypes(['Bags', 'Boxes', 'Packs']);
                    break;
                case 'Topping':
                    setUnitTypes(['Bags', 'Cans', 'Jars', 'Ounces', 'Pounds']);
                    break;
                default:
                    setUnitTypes([]);
            }
        };

        getUnitTypes();
    }, [inventoryAdd.type]);

    //Handles the input changes made by the user, includes input validation to prevent
    //user from imputting arithmetic symbols and more than 4 digits.
    //Input: User inputs
    //Output: sets values of inventoryAdd variable to the user inputs (matching each input
    //with the respective name within the json body of inventoryAdd)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'quantity') {
            const isValidQuantity = /^[0-9]{1,4}$/.test(value);
            if (!isValidQuantity) {
                return;
            }
        }
        setInventoryAdd({
            ...inventoryAdd,
            [name]: value,
        });
    };

    //Handles the form submission when user clicks on save performing axios endpoint calls
    //and letting use know the state of the system upon submission of form. Also redirects
    //once submission is successful.
    //Input: User form submission button click
    //Output: User form data sent to database thru axios endpoint call and status message
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post(`http://localhost:3001/inventory/`, inventoryAdd);
            setSuccessMessageInv('Inventory updated successfully!');
            setIsLoading(false);
            setTimeout(() => {
                navigate('/inventory');
            }, 2000);
        } catch (error) {
            setErrorMessageInv(`Error updating inventory!`);
            setTimeout(() => {
                setErrorMessageInv(false);
            }, 1500);
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ marginLeft: 'auto', marginRight: 'auto'}}>
                <div className='form-inv-adding'>
                    <div className='header-add-inv'>Add Inventory Item</div>
                    <form onSubmit={handleSubmit}>
                        <div className='input-field-cont'>
                            <div className='input-fields'>
                                <input
                                    type='text'
                                    name='name'
                                    value={inventoryAdd.name}
                                    onChange={handleInputChange}
                                    placeholder='Item Name'
                                />
                            </div>
                            <div className='input-fields'>
                                <select
                                    name='type'
                                    value={inventoryAdd.type}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Drink">Drink</option>
                                    <option value="Ingredient">Ingredient</option>
                                    <option value="Other">Other</option>
                                    <option value="Side">Side</option>
                                    <option value="Topping">Topping</option>
                                </select>
                            </div>
                            <div className='input-fields'>
                                <input
                                    type='number'
                                    min='0'
                                    max='9999'
                                    name='quantity'
                                    placeholder='Input Quantity'
                                    value={inventoryAdd.quantity}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className='input-fields'>
                                <select
                                    name='unitType'
                                    value={inventoryAdd.unitType}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Unit Type</option>
                                    {unitTypes.map((unitType) => (
                                        <option key={unitType} value={unitType}>
                                            {unitType}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {successMessageInv && <p className="success-message-inv">{successMessageInv}</p>}
                        {errorMessageInv && <p className="error-message-inv">{errorMessageInv}</p>}
                        <div className='save-item-button' onClick={handleSubmit}>
                            <button disabled={isLoading}>Save</button>
                        </div>
                        <div className='save-item-button' onClick={() => navigate("../inventory")}>
                            <button disabled={isLoading}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default InventoryAdd;