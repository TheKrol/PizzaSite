import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as FaIcons from "react-icons/fa6";
import './inventory.css';

function Inventory() {
  const [searchItem, setSearchItem] = useState('');
  const [inventoryData, setInventoryData] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  //Fetches the inventory using the axios get method and api call to that function in the backend
  //Input: API route and get request
  //Output: Data from inventory table or error if it cannot retrieve this data
  const fetchInventory = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/inventory`);
      console.log(response);
      setInventoryData(response.data);
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
      <div className="inventory-cont" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <div className='header-inventory'>
          Inventory View
        </div>
        <div className='inventory-bts'>
          <button onClick={() => navigate("../inventoryAdd")}>
              Add Item
          </button>
          <button onClick={() => navigate("../inventoryEdit")}>
            Edit Inventory
          </button>
          <button onClick={() => navigate("../inventoryTrack")}>
            Track Inventory
          </button>
        </div>
        <div className='inventory-search'>
          <input
            type='text'
            placeholder='Search Item'
            value={searchItem}
            onChange={handleSearch}
          />
        </div>
        <table className='table-inv'>
          <thead className='table-inv-head'>
            <tr className='table-row-inventory'>
              <th className='table-inv-header'>
                Name
                <button onClick={handleSortByName}><FaIcons.FaSort/></button>
              </th>
              <th className='table-inv-header'>
                Type
              </th>
              <th className='table-inv-header'>
                Quantity
              </th>
              <th className='table-inv-header'>
                Unit Type
              </th>
            </tr>
          </thead>
          <tbody className='table-body-inv'>
            {currentItems.map((item, index) => (
              <tr className='table-row-inventory' key={index}>
                <td className='table-inv-name'>{item.name}</td>
                <td className='table-inv-quantity'>{item.type}</td>
                <td className='table-inv-quantity'>{item.quantity}</td>
                <td className='table-inv-quantity'>{item.unitType}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='paging-buttons'>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              <FaIcons.FaCaretLeft/>
            </button>
            <span>{`Page ${currentPage}`}</span>
            <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={indexOfLastItem >= filteredInventoryData.length}
            >
              <FaIcons.FaCaretRight/>
            </button>
        </div>
      </div>
    </div>
  );
}

export default Inventory;