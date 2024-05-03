import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as FaIcons from "react-icons/fa6";
import './inventoryTrack.css';

function Inventory() {
  const [searchItem, setSearchItem] = useState('');
  const [invTrackData, setInvTrackData] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showButtons, setShowButtons] = useState(true);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  //Fetches the tracking table using axios.get method which is used to display the contents in the page
  //Input: API route and get request
  //Output: Data from tracking table or error if it cannot retrieve this data
  const fetchTracking = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/tracking`);
      console.log(response);
      setInvTrackData(response.data);
    } catch (error) {
      throw error;
    }
  };

  //Fetches the tracking list upon page load
  useEffect(() => {
    fetchTracking();
  }, []);

  //When the user enters/inputs in the search bar the list immedietaly shows the relevant terms
  //Input: User text input
  //Output: Relevant rows to what was entered in the search bar
  const handleSearch = (event) => {
    setSearchItem(event.target.value);
  };

  //Takes the id of the tracking table row/data row and deletes it from both the page & database
  //Input: The id from data row in database
  //Output: Deletes item in page & database and a successful delete popup message appears
  const handleDelete = async id => {
    const confirmDelete = window.confirm('Are you sure you want to delete this record?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/tracking/${id}`);
        console.log('Record deleted successfully.');
        setInvTrackData(prevInvTrackData => prevInvTrackData.filter(item => item._id !== id));
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  //Sorting function, sorts by name of item. Sorts in ascending or descending order each time the user
  //clicks the button
  //Input: Tracking list as is currently
  //Output: Sorted tracking list by name ascending or descending order
  const handleSortByName = () => {
    const sortedData = [...invTrackData].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setInvTrackData(sortedData);
  };

  const handleRowClick = (id) => {
    setSelectedRow(id === selectedRow ? null : id);
  };

  const handleCancelEdit = () => {
    setSelectedRow(null);
    setShowButtons(true);
  };

  //Filter the tracking data based on the search input
  //Input: Tracking row key data
  //Output: Filters out the other keys and outputs the name and type keys 
  const filteredInvTrackData = invTrackData.filter((item) => {
    return item.name.toLowerCase().includes(searchItem.toLowerCase())
  });

  //These set of variable/functions are used to create the paging feature using the use
  //state variable declared: currentPage, useCurrentPage and the variable itemsPerPage
  //that sets max amount of rows until it moves anything after that to the next page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvTrackData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="tracking-cont" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <div className='header-tracking'>
          Inventory Tracking
        </div>
        <div className='button-header'>
          <button onClick={() => navigate("../inventoryTrackForm")}>
            Add Tracking Entry
          </button>
          <button onClick={() => navigate("../inventory")}>
            Inventory View
          </button>
        </div>
        <div className='tracking-search'>
          <input
            type='text'
            placeholder='Search Item'
            value={searchItem}
            onChange={handleSearch}
          />
        </div>
        <table className='table-track'>
          <thead className='table-track-head'>
            <tr className='table-row-track'>
              <th className='table-track-header'>
                Shift
                <button onClick={handleSortByName}><FaIcons.FaSort /></button>
              </th>
              <th className='table-track-header'>
                Date
              </th>
              <th className='table-track-header'>
                Item Name
              </th>
              <th className='table-track-header'>
                Quantity
              </th>
              <th className='table-track-header'>
                Status
              </th>
            </tr>
          </thead>
          <tbody className='table-body-track'>
            {currentItems.map((item, index) => (
              <React.Fragment key={index}>
                <tr
                  className={`table-row-track ${selectedRow === item._id ? 'selected-row' : ''}`}
                  onClick={() => handleRowClick(item._id)}
                >
                  <td className='table-track-name'>{item.shift}</td>
                  <td className='table-track-quantity'>{item.date}</td>
                  <td className='table-track-quantity'>{item.name}</td>
                  <td className='table-track-quantity'>{item.quantity}</td>
                  <td className='table-track-quantity'>{item.status}</td>
                </tr>
                {selectedRow === item._id && (
                  <tr className='tracking-row-buttons'>
                    <td>
                      <div className="tracking-buttons">
                        <button className='button-save-tracking'
                          onClick={handleCancelEdit}>
                          Cancel
                        </button>
                        {showButtons && (
                          <React.Fragment>
                            <button className='button-delete-tracking' onClick={() => handleDelete(item._id)}>
                              Delete
                            </button>
                          </React.Fragment>
                        )}
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
            <FaIcons.FaCaretLeft />
          </button>
          <span>{`Page ${currentPage}`}</span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={indexOfLastItem >= filteredInvTrackData.length}
          >
            <FaIcons.FaCaretRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Inventory;