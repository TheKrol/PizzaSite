import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import * as FaIcons from "react-icons/fa6";
import './inventoryEdit.css';

const InventoryEdit = () => {
    const [searchItem, setSearchItem] = useState('');
    const [inventoryData, setInventoryData] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [editInventory, setEditInventory] = useState({
        _id: null,
        name: '',
        type: '',
        quantity: '',
        unitType: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredUnitTypes, setFilteredUnitTypes] = useState([]);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    //Fetches the inventory using the axios get method and api call to that function in the backend
    //Input: API route and get request
    //Output: Data from inventory table or error if it cannot retrieve this data
    const fetchInventory = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/inventory`);
          console.log(response);
          setInventoryData(response.data); // Update state with the fetched data
        } catch (error) {
          throw error;
        }
    };

    //Makes use of the fetchInventory() function when page loads.
    //Input: fetchInventory() function
    //Ouput: Inventory list display
    useEffect(() => {
        fetchInventory();
    }, []);

    //When the user enters/inputs in the search bar the list immedietaly shows the relevant terms
    //Input: User text input
    //Output: Relevant rows to what was entered in the search bar
    const handleSearch = (event) => {
        setSearchItem(event.target.value);
    };

    //Sorting function, sorts by name of item. Sorts in ascending or descending order each time the user
    //clicks the button
    //Input: Inventory list as is currently
    //Output: Sorted inventory list by name ascending or descending order
    const handleSortByName = () => {
        const sortedData = [...inventoryData].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
        });

        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setInventoryData(sortedData);
    };
    
    //Changes the state of editInventory to insert the edited values into a row. Also
    //makes use of input validation to ensure the name field is not left blank and to prevent
    //user from inputting arithmetic symbols in the quantity field and limiting number of
    //digits as well.
    //Input: name of the field to be edited and the actual value that has been edited
    //Output: updated field values for each field in the row or error message if field left blank
    const handleEditInventory = (fieldName, fieldValue) => {
        if (fieldName === 'name' && fieldValue.trim() === '') {
            setErrorMessage('Item name field is required');
            setTimeout(() => {
                setErrorMessage('');
            }, 1500);
            return;
        }
        if (fieldName === 'type') {
            setSelectedCategory(fieldValue);
            const categoryUnitTypes = getCategoryUnitTypes(fieldValue);
            setFilteredUnitTypes(categoryUnitTypes);
            if (!categoryUnitTypes.includes(editInventory.unitType)) {
                setEditInventory({
                    ...editInventory,
                    unitType: '',
                });
            }
        }
        if (fieldName === 'quantity') {
            const isValidQuantity = /^[0-9]{1,4}$/.test(fieldValue);
            if (!isValidQuantity) {
                return;
            }
        }
        const newFormData = { ...editInventory };
        newFormData[fieldName] = fieldValue;
        setEditInventory(newFormData);
    };

    const getCategoryUnitTypes = (category) => {
        switch (category) {
            case 'Drink':
                return ['Bottles - 2L', 'Bottles - 20oz', 'Cans'];
            case 'Ingredient':
                return ['Bags', 'Jars', 'Ounces', 'Pounds'];
            case 'Other':
                return ['Bags', 'Boxes', 'Packs'];
            case 'Side':
                return ['Bags', 'Boxes', 'Packs'];
            case 'Topping':
                return ['Bags', 'Cans', 'Jars', 'Ounces', 'Pounds'];
            default:
                return [];
        }
    };
    
    //Handles the submission when the user clicks on the save button, returns a message status if
    //the edit functions were successful or not and updates the inventory table with the edits
    //Input: inventory item row id
    //Output: Status message and updated inventory table
    const handleSubmit = async (id) => {
        try {
            await axios.put(`http://localhost:3001/inventory/${id}`, editInventory);
            const updatedInventoryData = filteredInventoryData.map((item) => {
                if (item._id === id) {
                    return editInventory;
                }
                return item;
            });
            setInventoryData(updatedInventoryData);
            setSuccessMessage('Inventory updated successfully!');
            setTimeout(() => {
                setSuccessMessage('');
            }, 1500);
            setEditInventory({
                _id: null,
                name: '',
                type: '',
                quantity: '',
                unitType: '',
            });
        } catch (error) {
            setErrorMessage('Error updating inventory!');
            setTimeout(() => {
                setErrorMessage('');
            }, 1500);
        }
    };

    //Allows the user to save the changes done on a row using a button
    //Input: Entire row data
    //Output: Edited row data
    const handleStartEdit = (item) => {
        setEditInventory(item);
        setSelectedRowId(item._id);
    };

    //Redirects user back to inventory page
    const handleRedirect = () => {
        navigate('/inventory');
    };

    //Cancels changes/edits done by the user by using a button and remove the edit fields
    //Input: Modified row data
    //Output: Original state of row data
    const handleCancelEdit = () => {
        setEditInventory({
            _id: null,
            name: '',
            type: '',
            quantity: '',
            unitType: '',
        });
        setSelectedRowId(null);
    };

    //Takes the id of the inventories table row/data row and deletes it from both the page & database
    //Input: The id from data row in databse
    //Output: Deletes item in page & database and a successful delete popup message appears
    const handleDelete = async id => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (confirmDelete) {
        try {
            await axios.delete(`http://localhost:3001/inventory/${id}`);
            console.log('Inventory item deleted successfully.');
            setInventoryData(prevInventoryData => prevInventoryData.filter(item => item._id !== id));
        } catch (error) {
            console.error('Error deleting inventory item:', error);
        }
        }
    };

    //Filter the inventory data based on the search input
    //Input: Inventory row key data
    //Output: Filters out the other keys and outputs the name and type keys 
    const filteredInventoryData = inventoryData.filter((item) => {
        return item.name.toLowerCase().includes(searchItem.toLowerCase()) || 
               item.type.toLowerCase().includes(searchItem.toLowerCase());
    });

    //These set of variable/functions are used to create the paging feature using the use
    //state variable declared: currentPage, useCurrentPage and the variable itemsPerPage
    //that sets max amount of rows until it moves anything after that to the next page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInventoryData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className='edit-item-form' style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <div className='item-edit-header'>
                Edit Inventory
            </div>
            {successMessage && <p className="success-message-inv-edit">{successMessage}</p>}
            {errorMessage && <p className="error-message-inv-edit">{errorMessage}</p>}
            <div className='inv-edit-buttons-top'>
                <button onClick={handleRedirect}>
                    Inventory View
                </button>
            </div>
            <div className='edit-inv-search'>
                <input
                    type='text'
                    placeholder='Search Item'
                    value={searchItem}
                    onChange={handleSearch}
                />
            </div>
                <table className='edit-inv-table'>
                    <thead className='edit-table-header'>
                        <tr className='row-edit'>
                            <th className='edit-head'>
                                Name
                                <button onClick={handleSortByName}><FaIcons.FaSort/></button>
                            </th>
                            <th className='edit-head'>
                                Type
                            </th>
                            <th className='edit-head'>
                                Quantity
                            </th>
                            <th className='edit-head'>
                                Unit Type
                            </th>
                        </tr>
                    </thead>
                    <tbody className='edit-table-body'>
                        {currentItems.map((item, index) => (
                            <React.Fragment key={item._id}>
                                <tr className='inv-edit-row'>
                                    <td className='table-edit-name'>
                                        {editInventory._id === item._id ? (
                                                <input
                                                    type='text'
                                                    value={editInventory.name}
                                                    onChange={(e) => handleEditInventory('name', e.target.value)}
                                                />
                                            ) : (
                                                <span onClick={() => handleStartEdit(item)}>{item.name}</span>
                                        )}
                                    </td>
                                    <td className='table-edit-quantity'>
                                        {editInventory._id === item._id ? (
                                            <select
                                                value={editInventory.type}
                                                onChange={(e) => handleEditInventory('type', e.target.value)}
                                            >
                                                <option value="">Select Category</option>
                                                <option value="Drink">Drink</option>
                                                <option value="Ingredient">Ingredient</option>
                                                <option value="Other">Other</option>
                                                <option value="Side">Side</option>
                                                <option value="Topping">Topping</option>
                                            </select>
                                        ) : (
                                            <span onClick={() => handleStartEdit(item)}>{item.type}</span>
                                        )}
                                    </td>
                                    <td className='table-edit-quantity'>
                                        {editInventory._id === item._id ? (
                                            <input
                                                type='number'
                                                min='0'
                                                max='9999'
                                                value={editInventory.quantity}
                                                onChange={(e) => handleEditInventory('quantity', e.target.value)}
                                            />
                                        ) : (
                                            <span onClick={() => handleStartEdit(item)}>{item.quantity}</span>
                                        )}
                                    </td>
                                    <td className='table-edit-quantity'>
                                        {editInventory._id === item._id ? (
                                            <select
                                                value={editInventory.unitType}
                                                onChange={(e) => handleEditInventory('unitType', e.target.value)}
                                            >
                                                <option value="">Select Unit Type</option>
                                                {filteredUnitTypes.map((unitType) => (
                                                    <option key={unitType} value={unitType}>
                                                        {unitType}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span onClick={() => handleStartEdit(item)}>{item.unitType}</span>
                                        )}
                                    </td>
                                </tr>
                                {selectedRowId === item._id && (
                                    <tr className='button-row'>
                                        <td>
                                            <div className="button-container">
                                                <button className='button-save' 
                                                onClick={() => handleSubmit(editInventory._id)}>
                                                    Save
                                                </button>
                                                <button className='button-save'
                                                onClick={handleCancelEdit}>
                                                    Cancel
                                                </button>
                                                <button className='button-delete' 
                                                onClick={() => handleDelete(item._id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                <div className='page-buttons'>
                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                        <FaIcons.FaCaretLeft/>
                    </button>
                    <span>{`Page ${currentPage}`}</span>
                    <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={indexOfLastItem >=filteredInventoryData.length}
                    >
                        <FaIcons.FaCaretRight/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventoryEdit;