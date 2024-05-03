import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import './employeeList.css';
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";


const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortColumn, setSortColumn] = useState('firstName');
    const [clickedEmployee, setClickedEmployee] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    const [selectedRole, setSelectedRole] = useState('all');
    const navigate = useNavigate();
    const [hoveredEmployee, setHoveredEmployee] = useState(null);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:3001/employees');
            const data = await response.json();
            const employeeList = data.filter(Employee => Employee.role === 'Employee' || Employee.role === 'Owner' || Employee.role === 'Manager');
            setEmployees(employeeList);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleDelete = async (employeeId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this Employee?');

        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:3001/employees/${employeeId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    console.log('Employee deleted successfully.');
                    fetchEmployees();
                } else {
                    console.error('Error deleting employee.');
                }
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };
    // Formatting the dob to be display better
    function getFormattedBirthday(dob) {
        if (!dob) return '';

        const date = new Date(dob);
        const formatter = new Intl.DateTimeFormat('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC',
        });

        return formatter.format(date);
    }


    const filteredEmployees = employees.filter((Employee) => {
        const fullName = `${Employee.firstName} ${Employee.lastName}`;
        return (
            fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedRole === 'all' || Employee.role === selectedRole)
        );
    });

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };


    const handleMouseEnter = (Employee) => {
        setHoveredEmployee(Employee);
    };
    const handleMouseLeave = () => {
        if (!clickedEmployee) {
            setHoveredEmployee(null);
        }
    };

    const handleFirstNameClick = (Employee) => {
        if (clickedEmployee === Employee) {
            setClickedEmployee(null);
            setHoveredEmployee(null);
        } else {
            setClickedEmployee(Employee);
            setHoveredEmployee(Employee);
        }
    };

    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const sortedEmployees = [...filteredEmployees];
    sortedEmployees.sort((a, b) => {
        const columnA = a[sortColumn]; // Get the actual value
        const columnB = b[sortColumn]; // Get the actual value

        // Custom comparison for dates
        if (sortColumn === 'dob') {
            const dateA = new Date(columnA);
            const dateB = new Date(columnB);

            if (sortOrder === 'asc') {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        }

        // Default comparison for strings
        if (sortOrder === 'asc') {
            return String(columnA).localeCompare(String(columnB));
        } else {
            return String(columnB).localeCompare(String(columnA));
        }
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedEmployees.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="employee-box">
            <Sidebar />
            <div className="list-container">
                <div className="employee-list">
                    <h2 className="header-emp-list">Employee List</h2>
                    <div className="search-bar" style={{ display: 'flex' }}>
                        <input
                            type="text"
                            placeholder="Search Employee"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <select id="role" value={selectedRole} onChange={handleRoleChange}>
                            <option value="all">All Roles</option>
                            <option value="Owner">Owner</option>
                            <option value="Manager">Manager</option>
                            <option value="Employee">Employee</option>
                        </select>
                    </div>
                    <table style={{ margin: '10px' }}>
                        <div className='em-table'>
                            <thead>
                                <tr>
                                    <th scope="col" className='v-center text-center' style={{ width: '50px' }}>
                                        First Name
                                        <button
                                            className="sort-button"
                                            onClick={() => handleSort('firstName')}
                                        >
                                            {sortColumn === 'firstName' && sortOrder === 'asc' && '▲'}
                                            {sortColumn === 'firstName' && sortOrder === 'desc' && '▼'}
                                        </button>
                                    </th>
                                    <th scope="col" className='v-center text-center' style={{ width: '50px' }}>
                                        Last Name
                                        <button
                                            className="sort-button"
                                            onClick={() => handleSort('lastName')}
                                        >
                                            {sortColumn === 'lastName' && sortOrder === 'asc' && '▲'}
                                            {sortColumn === 'lastName' && sortOrder === 'desc' && '▼'}
                                        </button>
                                    </th>
                                    {/* Add additional headers here */}
                                    <th scope="col" className='v-center text-center' style={{ width: '150px' }}>
                                        Email
                                    </th>
                                    <th scope="col" className='v-center text-center' style={{ width: '150px' }}>
                                        Role
                                    </th>
                                    <th scope="col" className='v-center text-center' style={{ width: '150px' }}>
                                        Phone
                                    </th>
                                    <th scope="col" className='v-center text-center' style={{ width: '150px' }}>
                                        Address
                                    </th>
                                    <th scope="col" className='v-center text-center' style={{ width: '130px' }}>
                                        Date of Birth
                                        <button
                                            className="sort-button"
                                            onClick={() => handleSort('dob')}
                                        >
                                            {sortColumn === 'dob' && sortOrder === 'asc' && '▲'}
                                            {sortColumn === 'dob' && sortOrder === 'desc' && '▼'}
                                        </button>
                                    </th>

                                    <th scope="col" className='v-center text-center' style={{ width: '80px' }}>
                                        Hourly Rate
                                    </th>

                                </tr>
                            </thead>
                            <tbody>

                                {currentItems.map((employee) => (
                                    <tr key={employee._id}>
                                        <td onMouseEnter={() => handleMouseEnter(employee)}
                                            onMouseLeave={handleMouseLeave}
                                            onClick={() => handleFirstNameClick(employee)}>
                                            <div className='action'>
                                                <FaIcons.FaInfoCircle style={{ marginRight: '10px' }} />
                                                {employee.firstName}
                                            </div>

                                            {(hoveredEmployee === employee || clickedEmployee === employee) && (
                                                <div className="action-dropdown">
                                                    <button
                                                        className="time-emp-button"
                                                        onClick={() => navigate(`/timesheet/${employee._id}`)}
                                                    >
                                                        Time Sheet
                                                    </button>
                                                    <button
                                                        className="edit-emp-button"
                                                        onClick={() => navigate(`/employee/${employee._id}/edit`)}
                                                    >
                                                        <MdIcons.MdEdit />
                                                    </button>
                                                    <button
                                                        className="delete-emp-button"
                                                        onClick={() => handleDelete(employee._id)}
                                                    >
                                                        <RiIcons.RiDeleteBin6Line />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td>{employee.lastName}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.role}</td>
                                        <td>{employee.phone}</td>
                                        <td>{employee.address}</td>
                                        <td>{getFormattedBirthday(employee.dob)}</td>
                                        <td>$ {employee.hRate}</td>
                                    </tr>
                                ))}

                            </tbody>
                        </div>
                    </table>
                    <div className="pagination">
                        {Array.from({ length: Math.ceil(sortedEmployees.length / itemsPerPage) }, (_, index) => (
                            <button key={index + 1} onClick={() => paginate(index + 1)}>
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default EmployeeList;
