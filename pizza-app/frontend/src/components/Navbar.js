import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import './Navbar.css'
import { CartContext } from '../context/CartContext'
import { FaShoppingCart } from 'react-icons/fa';

/**
 * Navbar component representing the navigation bar of the application.
 * Displays links to various product categories and a shopping cart icon.
 */
function Navbar() {
    // Access the cart data from the context
    const { cart } = useContext(CartContext);

    return (
        <div className="NavBar">
            {/* Navigation bar with links to different product categories */}
            <nav>
                <ul className="nav-links">
                    <li><a href="#Pizza">Pizza</a></li>
                    <li><a href="#Salad">Salad</a></li>
                    <li><a href="#Sides">Sides</a></li>
                    <li><a href='#Drink'>Drinks</a></li>
                    {/* Shopping cart link with a cart icon and item count */}
                    <li>
                        <Link to='/orderCart' className="cart-link">
                            <FaShoppingCart /> {cart.items.length > 0 ? `(${cart.items.length})` : ''}
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

// Exporting the Navbar component as the default export
export default Navbar;
