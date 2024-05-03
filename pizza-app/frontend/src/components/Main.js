import React from 'react';
import './Main.css';
import Sidebar from './Sidebar';
import PizzaConnection from '../image/PizzaConnection.png';
import { Link } from 'react-router-dom';

function Main() {
    return (
        <div>
            {/* Sidebar Component */}
            <Sidebar />

            {/* Image Container */}
            <div className="image-container">
                {/* Main Image */}
                <img src={PizzaConnection} alt="Pizza 1" className="image" style={{ width: '100%' }} />

                {/* Order Now Button linking to "/pizzaMenu" */}
                <div className="order-now-button">
                    <Link to="/pizzaMenu">Order Now</Link>
                </div>
            </div>

            {/* Video Containers */}
            <div className="video-container">
                {/* First Video */}
                <video width="100%" height="100%" autoPlay muted loop playsInline>
                    <source src={require('../image/wintersale.mp4')} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                
                {/* Second Video */}
                <video width="100%" height="100%" autoPlay muted loop playsInline>
                    <source src={require('../image/introvideo.mp4')} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* About Us Button linking to "/Learn more " */}
            <div className="about-us-button">
                <Link to="/about">Learn More</Link>
            </div>
        </div>
    );
}

export default Main;
