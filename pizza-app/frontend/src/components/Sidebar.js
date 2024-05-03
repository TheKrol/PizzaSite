import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Sidebar.css';
import axios from 'axios';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from "react-icons/si";
import * as AiIcons from "react-icons/ai";
import * as MdIcons from "react-icons/md";
import * as ImIcons from "react-icons/im";

const routes = [
    { path: '/', name: 'Home' },
    {/*{ path: '/pizzaMenu', name: 'PizzaMenu' },*/ }
];

// NavBar component for horizontal navigation
const NavBar = ({ menu, toggleSidebar, isSidebarOpen }) => {
    return (
        <nav className="horizontal-nav">
            <div className="burger-menu" onClick={toggleSidebar}>
                {isSidebarOpen ? <AiIcons.AiOutlineClose /> : <FaIcons.FaBars />}
            </div>
            <ul>
                {menu.map((item, index) => (
                    <li key={index}>
                        <Link to={item.path}>{item.name}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

// Main Sidebar component
const Sidebar = () => {
    const navigate = useNavigate()
    const { logout } = useLogout()
    const { user } = useAuthContext()

    const [User, setUser] = useState({ role: '', _id: '' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const fetchUserProfile = async (email) => {
        try {
            const response = await axios.get(`http://localhost:3001/user/profile/${encodeURIComponent(email)}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return { role: '', _id: '' };
        }
    };

    // UseEffect hook to fetch user data on component mount
    useEffect(() => {
        if (user) {
            const fetchExistingData = async () => {
                try {
                    const existingUserData = await fetchUserProfile(user.email);
                    setUser(existingUserData);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            };

            fetchExistingData();
        }
    }, [user]);

    // Function to handle logout
    const handleCLick = () => {
        logout();
        setUser({ role: ' ' });
        navigate('/');
    };

    // Function to toggle sidebar open/close state
    const toggleSidebar = () => {
        console.log("Toggling Sidebar");
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            <NavBar menu={routes} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>

                <ul>
                    {/* For All User */}
                    {!user && (
                        <div>
                            <li onClick={() => navigate("../login")}>
                                <div className="icon-and-text">
                                    <FaIcons.FaPortrait />Account
                                </div>
                            </li>
                            <li onClick={() => navigate("../pizzaMenu")}>
                                <div className="icon-and-text">
                                    <FaIcons.FaPizzaSlice />Pizza Menu
                                </div>
                            </li>
                        </div>
                    )}
                    {/* For Business */}
                    {(User.role === "Owner" || User.role === "Manager") && (

                        <div>
                            <li onClick={() => navigate("../pizzaMenu")}>
                                <div className="icon-and-text">
                                    <FaIcons.FaPizzaSlice />Pizza Menu
                                </div>
                            </li>

                            <li onClick={() => navigate("../employee")}>
                                <div className="icon-and-text">
                                    <SiIcons.SiGoogletagmanager />
                                    Manage Employees
                                </div>
                            </li>
                            <li onClick={() => navigate("../employee-create")}>
                                <div className="icon-and-text">
                                    <AiIcons.AiOutlineUsergroupAdd />
                                    Add Employee
                                </div>
                            </li>
                            <li onClick={() => navigate("../inventory")}>
                                <div className="icon-and-text">
                                    <MdIcons.MdInventory />
                                    Manage Inventory
                                </div>
                            </li>
                            <li onClick={() => navigate(`/time-entry/${User._id}`)}>
                                <div className="icon-and-text">
                                    <AiIcons.AiFillClockCircle />Time Clock
                                </div>
                            </li>
                            <li onClick={() => navigate("../order-list")}>
                                <div className="icon-and-text">
                                    <div className="black-icon">
                                        <FaIcons.FaSellsy />
                                    </div>
                                    Order List
                                </div>
                            </li>
                        </div>
                    )}
                    {/* For Employee */}
                    {User.role === "Employee" && (
                        <div>
                            <li onClick={() => navigate("../pizzaMenu")}>
                                <div className="icon-and-text">
                                    <FaIcons.FaPizzaSlice />Pizza Menu
                                </div>
                            </li>
                            <li onClick={() => navigate(`/time-entry/${User._id}`)}>
                                <div className="icon-and-text">
                                    <AiIcons.AiFillClockCircle />Time Clock
                                </div>
                            </li>
                            <li onClick={() => navigate("../inventory")}>
                                <div className="icon-and-text">
                                    <MdIcons.MdInventory />
                                    Manage Inventory
                                </div>
                            </li>
                            <li onClick={() => navigate("../order-list")}>
                                <div className="icon-and-text">
                                    <div className="black-icon">
                                        <FaIcons.FaSellsy />
                                    </div>
                                    Order List
                                </div>
                            </li>
                        </div>
                    )}
                    {/* For Customer */}
                    {User.role === "Customer" && (
                        <div>
                            <li onClick={() => navigate("../pizzaMenu")}>
                                <div className="icon-and-text">
                                    <FaIcons.FaPizzaSlice />Pizza Menu
                                </div>
                            </li>
                        </div>
                    )}
                    {user && (
                        <div>
                            <li onClick={() => navigate("../profile")}>
                                <div className="icon-and-text">
                                    <ImIcons.ImProfile />
                                    Profile
                                </div>
                            </li>
                            <li onClick={handleCLick}>
                                <div className="icon-and-text">
                                    <FaIcons.FaSignOutAlt />
                                    Log Out
                                </div>
                            </li>
                        </div>
                    )}

                </ul>
            </div >


        </div>
    );
};

export default Sidebar;
