import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import './orderList.css';

function OrderList() {
    // State variables for managing orders, search terms, sorting, and pagination
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortColumn, setSortColumn] = useState('email');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [selectedOrderType, setSelectedOrderType] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    // Fetch orders from the server and sort them to show the latest order first
    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:3001/order');
            const data = await response.json();
            console.log(data);
            // Sort data to show the latest order at the top
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedData);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    // Update the status of an order
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:3001/order/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                // Update the local state or trigger a refetch
                fetchOrders();
            } else {
                console.error('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    }

    // Handle sorting of order list
    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder(column === 'date' ? 'desc' : 'asc'); // Default to descending for dates
        }
    }

    // Retrieve the value of a given column from an order
    const getColumnValue = (order, column) => {
        if (column === 'user.email') {
            return order.user?.email?.toLowerCase() || order.email?.toLowerCase() || '';
        } else if (column === 'orderType') {
            return order.orderType?.toLowerCase() || '';
        } else if (column === 'date') {
            return order.createdAt || '';
        } else if (column === 'status') {
            return order.status || '';
        }
        return '';
    };

    const sortedOrders = [...orders];
    sortedOrders.sort((a, b) => {
        const columnA = getColumnValue(a, sortColumn).toLowerCase();
        const columnB = getColumnValue(b, sortColumn).toLowerCase();

        if (sortColumn === 'status') {
            // When sorting by status, consider the order of the status values
            const statusOrder = ['In Progress', 'Completed'];
            return statusOrder.indexOf(columnA) - statusOrder.indexOf(columnB);
        } else {
            // For other columns, use standard sorting
            if (sortOrder === 'asc') {
                return columnA.localeCompare(columnB);
            } else {
                return columnB.localeCompare(columnA);
            }
        }
    });

    const filteredOrders = orders.filter(order => {
        const email = order.email.toLowerCase();
        const matchesSearchTerm = email.includes(searchTerm.toLowerCase());
        if (selectedOrderType === '') {
            return matchesSearchTerm;
        } else {
            return matchesSearchTerm && order.orderType === selectedOrderType;
        }
    });

    // Combine sorting and filtering for final order display
    const sortedAndFilteredOrders = orders
        .filter(order => {
            const email = order.email.toLowerCase();
            const matchesSearchTerm = email.includes(searchTerm.toLowerCase());
            if (selectedOrderType === '') {
                return matchesSearchTerm;
            } else {
                return matchesSearchTerm && order.orderType === selectedOrderType;
            }
        })
        .filter(order => {
            // Filter based on selected status
            return selectedStatus ? order.status === selectedStatus : true;
        })
        .sort((a, b) => {
            const columnA = getColumnValue(a, sortColumn).toLowerCase();
            const columnB = getColumnValue(b, sortColumn).toLowerCase();

            if (sortColumn === 'status') {
                // When sorting by status, consider the order of the status values
                const statusOrder = ['In Progress', 'Completed'];
                return statusOrder.indexOf(columnA) - statusOrder.indexOf(columnB);
            } else {
                // For other columns, use standard sorting
                if (sortOrder === 'asc') {
                    return columnA.localeCompare(columnB);
                } else {
                    return columnB.localeCompare(columnA);
                }
            }
        });

    // Pagination Logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Format date and time for display
    const formatStandardDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString(); // Gets the date in local format
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0'); // Formats minutes to two digits
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const formattedHours = hours.toString().padStart(2, '0');

        return `${formattedDate}, ${formattedHours}:${minutes} ${ampm}`;
    }

    // Calculate total orders, sales, and quantity
    const totalOrders = filteredOrders.length;

    // Calculate total price of an order
    const calculateTotalPrice = (order) => {
        const total = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        return total.toFixed(2);
    }

    //Add 6% tax with total price.
    const calculateTotalPriceWithTax = (order) => {
        const totalPrice = calculateTotalPrice(order);
        const tax = 0.06; // 6% tax
        const totalPriceWithTax = (totalPrice * (1 + tax)).toFixed(2);
        return totalPriceWithTax;
    }
    // New state for modal visibility and selected item details
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Function to open modal with item details
    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    // Function to close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    // Dynamically render item details based on type
    const renderItemDetails = (item) => {
        switch (item.type) {
            case 'Pizza':
                return (
                    <div>
                        <p>Size: {item.size}</p>
                        <p>Crust: {item.crust}</p>
                        <p>Sauce: {item.sauce}</p>
                        <p>Toppings:<br />
                            {item.toppings && item.toppings.left && item.toppings.left.length > 0 && (
                                <>
                                    &nbsp;&nbsp;Left: {item.toppings.left.join(', ')}
                                    <br />
                                </>
                            )}
                            {item.toppings && item.toppings.right && item.toppings.right.length > 0 && (
                                <>
                                    &nbsp;&nbsp;Right: {item.toppings.right.join(', ')}
                                    <br />
                                </>
                            )}
                            {item.toppings && item.toppings.full && item.toppings.full.length > 0 && (
                                <>
                                    &nbsp;&nbsp;Full: {item.toppings.full.join(', ')}
                                    <br />
                                </>
                            )}
                        </p>
                    </div>
                );
            case 'Salad':
                return (
                    <div>
                        <p>Size: {item.size}</p>
                        <p>Dressing: {item.dressing}</p>
                        {item.toppings && item.toppings.salad && (
                            <p>
                                Toppings: {item.toppings.salad.join(', ')}
                            </p>
                        )}
                    </div>
                );
            case 'Sides':
                return <p>Name: {item.name}</p>;
            case 'Drink':
                return <p>Name: {item.name}</p>;
            default:
                return <p>Item details not available</p>;
        }
    };

    return (
        <div className="order-track-box">
            <Sidebar />
            <div className="order-list-container">
                <h1 className="order-list-title">Order List</h1>
                <div className="search-and-filter">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search Order"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="select-container">
                        <select
                            className="order-type-select"
                            onChange={(e) => setSelectedOrderType(e.target.value)}
                            value={selectedOrderType}
                        >
                            <option value="">All Delivery</option>
                            <option value="pickup">Pick Up</option>
                            <option value="delivery">Delivery</option>
                        </select>
                    </div>
                    <div className="select-container">
                        {/* Order Status dropdown */}
                        <select
                            className="order-type-select"
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                            }}
                            value={selectedStatus}>
                            <option value="">Status</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
                <div className="totals">
                    Total Orders: {totalOrders}
                </div>
                <div className="table-responsive">
                    <table className="responsive-table">
                        <thead>
                            <tr>
                                <th className='v-center text-center' onClick={() => handleSort('user.email')}>
                                    Email
                                    {sortColumn === 'user.email' && sortOrder === 'asc' && <span className="sort-indicator">▲</span>}
                                    {sortColumn === 'user.email' && sortOrder === 'desc' && <span className="sort-indicator">▼</span>}
                                </th>
                                <th className='v-center text-center' onClick={() => handleSort('orderType')}>
                                    Order Type
                                </th>
                                <th className='v-center text-center'>
                                    Items
                                </th>
                                <th className='v-center text-center'>
                                    Total Price
                                </th>
                                <th className='v-center text-center' onClick={() => handleSort('date')}>
                                    Date & Time
                                    {sortColumn === 'date' && sortOrder === 'asc' && '▲'}
                                    {sortColumn === 'date' && sortOrder === 'desc' && '▼'}
                                </th>
                                <th className='v-center text-center'>
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {sortedAndFilteredOrders.slice(startIndex, endIndex).map((order) => (
                                <tr key={order._id}>
                                    <td>{order.email}</td>
                                    <td>{order.orderType}</td>
                                    <td>
                                        <ul className="order-items-list">
                                            {order.items.map((item, index) => (
                                                <li className="order-item" key={index}>
                                                    <button onClick={() => openModal(item)}>
                                                        <h3>{item.type} Details</h3>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>

                                    <td>${calculateTotalPriceWithTax(order)}</td>
                                    <td>{formatStandardDateTime(order.createdAt)}</td>
                                    <td>
                                        <div className="order-status" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                style={{ display: 'block', width: '100%' }}
                                            >
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        {Array.from({ length: Math.ceil(filteredOrders.length / itemsPerPage) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={currentPage === index + 1 ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    {/* Modal component */}
                    {isModalOpen && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close-button" onClick={closeModal}>&times;</span>
                                {/* Display selected item details */}
                                <h3>{selectedItem.type} Details</h3>
                                {selectedItem && (
                                    <div>
                                        {renderItemDetails(selectedItem)}
                                        <p>Price: ${selectedItem.price.toFixed(2)}</p>
                                        <p>Quantity: {selectedItem.quantity}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default OrderList;
