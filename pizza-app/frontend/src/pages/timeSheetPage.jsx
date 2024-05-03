import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import './timeSheet.css';
import ClkIn from '../image/clockIn.png';
import ClkOut from '../image/clockOut.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import html2pdf from 'html2pdf.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Modal.setAppElement('#root');

// State initialization for various time tracking and employee details
const TimeSheetPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeEntries, setTimeEntries] = useState([]);
  const [employeefirstName, setEmployeeName] = useState('');
  const [employeelastName, setEmployeeLastName] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [filteredTimeEntries, setFilteredTimeEntries] = useState([]);
  const [totalWeeklyHours, setTotalWeeklyHours] = useState(null);
  const [lastClockInTime, setLastClockInTime] = useState(null);
  const [dailyWorkingHours, setDailyWorkingHours] = useState(0);
  const [accumulatedWorkingHours, setAccumulatedWorkingHours] = useState(0);
  const { id } = useParams();

  // Fetches time entries and employee details from API on component mount and sets     interval    for current time update
  // Input: Employee ID from URL params
  // Output: Sets time entries, weekly hours, and employee details in the state.
  useEffect(() => {
    const storedStatus = localStorage.getItem('isClockedIn');
    if (storedStatus) {
      setIsClockedIn(storedStatus === 'true');
    }
    const fetchTimeEntries = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/time-entries/${id}`);
        setTimeEntries(response.data);

        // Calculate and set total weekly hours
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of the current week (Sunday)

        const endOfWeek = new Date();
        endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the current week (Saturday)

        const weeklyTimeEntries = response.data.filter((entry) => {
          const entryTime = new Date(entry.time);
          return entryTime >= startOfWeek && entryTime <= endOfWeek;
        });

        let totalWeeklyHours = 0;

        for (let i = 0; i < weeklyTimeEntries.length - 1; i += 2) {
          const clockInTime = new Date(weeklyTimeEntries[i].time);
          const clockOutTime = new Date(weeklyTimeEntries[i + 1].time);

          const diffMs = clockOutTime - clockInTime;
          const hours = Math.floor(diffMs / 3600000);
          const minutes = Math.floor((diffMs % 3600000) / 60000);
          const duration = hours + minutes / 60;

          totalWeeklyHours += duration;
        }

        setTotalWeeklyHours(`${Math.floor(totalWeeklyHours)} hours ${Math.floor((totalWeeklyHours % 1) * 60)} minutes`);
      } catch (error) {
        console.error('Error fetching time entries:', error);
      }
    };

    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/employees/${id}`);
        setEmployeeName(response.data.firstName);
        setEmployeeLastName(response.data.lastName);
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchTimeEntries();
    fetchEmployeeDetails();

    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [id]);


  // Calculates total working hours for the current day
  // Output: String representing total working hours for the current day
  const calculateWorkingHours = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter clock in and clock out entries for today
    const todayTimeEntries = timeEntries.filter((entry) => {
      const entryTime = new Date(entry.time);
      entryTime.setHours(0, 0, 0, 0);
      return entryTime.getTime() === today.getTime();
    });

    // Sort the entries by time
    todayTimeEntries.sort((a, b) => new Date(a.time) - new Date(b.time));

    let totalWorkingHours = accumulatedWorkingHours;

    for (let i = 0; i < todayTimeEntries.length - 1; i += 2) {
      const clockInTime = new Date(todayTimeEntries[i].time);
      const clockOutTime = new Date(todayTimeEntries[i + 1].time);

      const diffMs = clockOutTime - clockInTime;
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);
      const duration = hours + minutes / 60;

      totalWorkingHours += duration;
    }

    return `${Math.floor(totalWorkingHours)} hours ${Math.floor((totalWorkingHours % 1) * 60)} minutes`;
  };

  // Calculates total working hours for the current week
  // Output: String representing total working hours for the current week

  const calculateWeeklyTotalHours = () => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of the current week (Sunday)

    const endOfWeek = new Date();
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the current week (Saturday)

    const weeklyTimeEntries = timeEntries.filter((entry) => {
      const entryTime = new Date(entry.time);
      return entryTime >= startOfWeek && entryTime <= endOfWeek;
    });

    let totalWeeklyHours = 0;

    for (let i = 0; i < weeklyTimeEntries.length - 1; i += 2) {
      const clockInTime = new Date(weeklyTimeEntries[i].time);
      const clockOutTime = new Date(weeklyTimeEntries[i + 1].time);

      const diffMs = clockOutTime - clockInTime;
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);
      const duration = hours + minutes / 60;

      totalWeeklyHours += duration;
    }

    return `${Math.floor(totalWeeklyHours)} hours ${Math.floor((totalWeeklyHours % 1) * 60)} minutes`;
  };

  const displayToaster = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 1500,
    });
  };

  // Handles clock in and clock out actions
  // Input: Type of action ('Clock In' or 'Clock Out')
  const handleClock = async (type) => {
    if (type === 'Clock In' && !isClockedIn) {
      setIsClockedIn(true);
      setLastClockInTime(new Date()); // Set the last clock in time
      displayToaster('Successfully Clocked In');
      localStorage.setItem('isClockedIn', 'true');
    } else if (type === 'Clock Out' && isClockedIn) {
      setIsClockedIn(false);
      displayToaster('Successfully Clocked Out');
      localStorage.removeItem('isClockedIn');

      // Only calculate time if there was a previous clock in
      if (lastClockInTime) {
        // Calculate the time difference since the last clock in
        const timeDifference = new Date() - lastClockInTime;
        const hours = Math.floor(timeDifference / 3600000);
        const minutes = Math.floor((timeDifference % 3600000) / 60000);
        // Update the daily working hours
        setDailyWorkingHours(dailyWorkingHours + hours + minutes / 60);
      }
      // Add the clock out entry to the state
      const clockOutEntry = {
        user_id: id,
        time_type: 'Clock Out',
        time: new Date(),
      };
      setTimeEntries([...timeEntries, clockOutEntry]);
    }
    try {
      if (type === 'Clock In' || type === 'Clock Out') {
        const response = await axios.post(`http://localhost:3001/time-entries`, {
          user_id: id,
          time_type: type,
          time: new Date(),
        });

        const newTimeEntry = response.data;

        if (type === 'Clock Out' && lastClockInTime) {
          const diffMs = new Date(newTimeEntry.time) - lastClockInTime;
          const hours = Math.floor(diffMs / 3600000);
          const minutes = Math.floor((diffMs % 3600000) / 60000);
          const duration = hours + minutes / 60;

          setAccumulatedWorkingHours(accumulatedWorkingHours + duration);
        }

        setTimeEntries([...timeEntries, newTimeEntry]);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting time entry:', error);
    }
  };

  const openModal = (entry) => {
    setEditingEntry(entry);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingEntry(null);
  };

  const handleUpdate = async (updatedEntry) => {
    try {
      const response = await axios.put(`http://localhost:3001/time-entries/${updatedEntry._id}`, updatedEntry);

      const updatedIndex = timeEntries.findIndex((entry) => entry._id === updatedEntry._id);
      if (updatedIndex !== -1) {
        timeEntries[updatedIndex] = response.data;
        setTimeEntries([...timeEntries]);
        closeModal();
        alert("Updated Successfully");
      }
    } catch (error) {
      console.error('Error updating time entry:', error);
    }
  };

  const handleDelete = async (entryId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this time entry?');
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/time-entries/${entryId}`);

      const updatedTimeEntries = timeEntries.filter((entry) => entry._id !== entryId);
      setTimeEntries(updatedTimeEntries);
      closeModal();
      toast("Entry deleted successfully", { autoClose: 1000 }); // Using toast instead of alert
    } catch (error) {
      console.error('Error deleting time entry:', error);
      toast.error("Error deleting entry", { autoClose: 1000 }); // Error toast
    }
  };

  function formatDateForInput(dateString) {
    if (!dateString) {
      return '';
    }
    // Check if the input is a valid date
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }

    // Format the date as 'YYYY-MM-DDTHH:MM' for datetime-local input
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const handleDownloadPDF = () => {
    // Create an HTML string for the report
    const reportHtml = generateReportHtml();

    // Create a DOM element from the HTML string
    const reportElement = document.createElement('div');
    reportElement.innerHTML = reportHtml;

    // Generate PDF using html2pdf
    html2pdf(reportElement, {
      margin: 10,
      filename: 'time_entries_report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' },
    });
  };

  const generateReportHtml = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const totalWorkingHours = calculateWorkingHours();

    const calculateTotalWeeklyHoursForPDF = () => {
      let totalWeeklyHours = 0;

      for (let i = 0; i < timeEntries.length - 1; i += 2) {
        const clockInTime = new Date(timeEntries[i].time);
        const clockOutTime = new Date(timeEntries[i + 1].time);

        const diffMs = clockOutTime - clockInTime;
        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);
        const duration = hours + minutes / 60;

        totalWeeklyHours += duration;
      }

      return `${Math.floor(totalWeeklyHours)} hours ${Math.floor((totalWeeklyHours % 1) * 60)} minutes`;
    };

    // Calculate total weekly hours specifically for PDF
    const totalWeeklyHoursForPDF = calculateTotalWeeklyHoursForPDF();

    return `
        <html>
            <head>
                <title>Time Entries Report</title>
                <style>
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        margin-top: 20px;
                    }
                    th, td {
                        border: 1px solid #dddddd;
                        text-align: left;
                        padding: 8px;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    h1 {
                        text-align: center;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 20px;
                    }
                    .total-hours {
                        text-align: center;
                        margin-top: 20px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Time Entries Report of ${employeefirstName} ${employeelastName}</h1>
                    <p>${currentDate}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Clock In</th>
                            <th>Clock Out</th>
                            <th>Daily Working Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${timeEntries.map((entry, index, entries) => `
                            <tr>
                                <td>${new Date(entry.time).toDateString()}</td>
                                <td>${entry.time_type === 'Clock In' ? new Date(entry.time).toLocaleTimeString() : ''}</td>
                                <td>${entry.time_type === 'Clock Out' ? new Date(entry.time).toLocaleTimeString() : ''}</td>
                                <td>${index > 0 && entry.time_type === 'Clock Out' ? calculateDailyWorkingHours(entries[index - 1], entry) : ''}</td>
                          </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p className='text-center' style={{ fontSize: '26px', marginTop: '10px' }}>
                  Total Weekly Hours: ${totalWeeklyHoursForPDF || 'N/A'}
                </p>
            </body>
        </html>
    `;
  };

  const calculateDailyWorkingHours = (clockInEntry, clockOutEntry) => {
    const diffMs = new Date(clockOutEntry.time) - new Date(clockInEntry.time);
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    return `${hours} hours ${minutes} minutes`;
  };

  const handleFilterSubmit = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/time-entries/${id}`);
      const allTimeEntries = response.data;

      // Filter entries for the selected week
      const filteredEntries = allTimeEntries.filter((entry) => {
        const entryDate = new Date(entry.time);
        return (
          (!startDate || entryDate >= startDate) &&
          (!endDate || entryDate <= endDate)
        );
      });

      // Sort entries by date
      filteredEntries.sort((a, b) => new Date(a.time) - new Date(b.time));

      // Update state with filtered and sorted entries
      setTimeEntries(filteredEntries);
    } catch (error) {
      console.error('Error fetching time entries for the selected week:', error);
    }
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = timeEntries.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(timeEntries.length / entriesPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div>
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(number)}>
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="time-entry-page-container">
      <Sidebar />
      <div className="content-container">
        <ToastContainer position="top-center" />
        <div className="time-content">
          <div className="time-square">

            <div className="time-box">
              <div className="header-time">Time Clock</div>
              <div className="current-time">{currentTime.toLocaleTimeString()}</div>
              <div className="employee-name-status">
                {employeefirstName}
                <span className={`status-badge ${isClockedIn ? 'clock-in' : 'clock-out'}`}>
                  {isClockedIn ? 'Clocked In' : 'Clocked Out'}
                </span>
              </div>
              <div className="clock">
                <img src={ClkIn} alt="Clock In" className="image" style={{ width: '40%' }} />
                <img src={ClkOut} alt="Clock Out" className="image" style={{ width: '40%' }} />
              </div>

              <div className="clock-buttons-container">
                <button onClick={() => handleClock('Clock In')} className="btn btn-clock-in" disabled={isClockedIn}>
                  Clock In
                </button>
                <button onClick={() => handleClock('Clock Out')} className="btn btn-clock-out" disabled={!isClockedIn}>
                  Clock Out
                </button>
              </div>
            </div>
            <div className="time-box">
              <div className="header-time">Time Sheet of {employeefirstName}</div>
              <p className='text-center' style={{ fontSize: '20px' }}>Working Hours Today: {calculateWorkingHours()}</p>
              <p className='text-center' style={{ fontSize: '20px', marginTop: '10px' }}>
                Total Weekly Hours: {totalWeeklyHours}
              </p>

              <div>
                <label>Filter by Week:</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                  />
                  <span style={{ margin: '0 10px' }}>to</span>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="End Date"
                  />
                  <div style={{ marginLeft: '30px' }}><button className='edit-button' onClick={handleFilterSubmit}>Submit</button></div>
                </div>
              </div>
              {timeEntries.length > 0 ? (
                <div style={{ marginTop: '10px' }}>
                  <button
                    id="download-button"
                    className="btn btn-primary"
                    onClick={handleDownloadPDF}
                  >
                    Download Time Entries as PDF
                  </button>
                  <table className="table table-responsive" id="time-entries-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center' }}>Day</th>
                        <th style={{ textAlign: 'center' }}>Clock In</th>
                        <th style={{ textAlign: 'center' }}>Clock Out</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEntries.map((entry) => (
                        <tr key={entry._id}>
                          <td style={{ textAlign: 'center' }}>{new Date(entry.time).toDateString()}</td>
                          <td style={{ textAlign: 'center' }}>{entry.time_type === 'Clock In' ? new Date(entry.time).toLocaleTimeString() : ''}</td>
                          <td style={{ textAlign: 'center' }}>{entry.time_type === 'Clock Out' ? new Date(entry.time).toLocaleTimeString() : ''}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              className="edit-button"
                              onClick={() => openModal(entry)}
                            >
                              Edit
                            </button>

                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(entry._id)}
                            >
                              Delete
                            </button>

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {renderPagination()}
                </div>
              ) : (
                <div className="time-text-center">No time entries to display.</div>
              )}
            </div>
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Edit Time Entry"
        >
          {editingEntry && (
            <div className="edit-modal">
              <h2 className="header-modal">Edit Time Entry</h2>
              <form>
                <div className="modal-group">
                  <label htmlFor="datetime">Date and Time:</label>
                  <input
                    type="datetime-local"
                    id="datetime"
                    value={formatDateForInput(editingEntry.time)}
                    onChange={(e) => setEditingEntry({ ...editingEntry, time: e.target.value })}
                  />
                </div>
                <div className="button-group">
                  <button className="cancel-button" onClick={() => closeModal()}>Cancel</button>
                  <button className="em-update-button" onClick={() => handleUpdate(editingEntry)}>Update</button>
                </div>
              </form>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default TimeSheetPage;