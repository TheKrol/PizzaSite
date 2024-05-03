import React from 'react';
import logo from '../image/logo.PNG'; // Update with the correct path
import './Header.css';
import { Link } from 'react-router-dom';


const Header = () => {
    return (
        <div className="header">
            <Link to="/">
                <img src={logo} alt="Logo" className="logo" height={70} width={70} />
            </Link>

            <h2 className='header-main'>Pizza Connection</h2>
        </div>
    );
};

export default Header; 