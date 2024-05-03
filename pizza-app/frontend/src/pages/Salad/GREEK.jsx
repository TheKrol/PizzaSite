import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import GREEKimg from '../../image/GREEK.png';
import { useCartActions } from '../../context/CartContext';
import '../Salad/Salad.css'

function ANTI() {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const cartActions = useCartActions(); // Added to access cart manipulation functions
    const navigate = useNavigate();
    const [size, setSize] = useState('Large');
    const [dressing, setDressing] = useState('Greek');
    const [price, setPrice] = useState(9.99);
    const [quantity, setQuantity] = useState(1);
    const initialToppings = [ "Black Olives", "Beats", "Feta", "Pepperoncini", "Tomatoes"]; // Define the initial toppings
    const [toppings, setToppings] = useState(initialToppings);
    const [numberOfToppingsSelected, setNumberOfToppingsSelected] = useState(initialToppings.length);

    // Handling Topping changes
    const handleToppingsChange = (e) => {
        const selectedTopping = e.target.value;
        const isChecked = e.target.checked;
    
        // Calculate the change in the number of toppings selected
        const changeInToppings = isChecked ? 1 : -1;
    
        // Calculate the new number of toppings selected
        const newNumberOfToppingsSelected = numberOfToppingsSelected + changeInToppings;
    
        // Define the base prices for different sizes
        const sizePrices = {
            Large: 9.99,
            Small: 7.99,
        };
    
        // Get the base price for the selected size
        const basePrice = sizePrices[size];
    
        // Calculate the new price based on the selected size and toppings
        let newPrice = basePrice + (newNumberOfToppingsSelected - initialToppings.length) * 1.29;
    
        // Ensure the price doesn't go below the base price
        if (newPrice < basePrice) {
            newPrice = basePrice;
        }
    
        // Update the state
        setToppings(isChecked ? [...toppings, selectedTopping] : toppings.filter((topping) => topping !== selectedTopping));
        setNumberOfToppingsSelected(newNumberOfToppingsSelected);
        setPrice(newPrice);
    };

    // Handling Quantity change
    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    // Handling Dressing change
    const handleDressingChange = (e) => {
        setDressing(e.target.value);
    };

    // Handling Size change
    const handleSizeChange = (e) => {
        const newSize = e.target.value;
        
        // Define the base prices for different sizes
        const sizePrices = {
            Large: 9.99,
            Small: 7.99,
        };

        // Calculate the new price based on the selected size
        const newPrice = sizePrices[newSize] + (numberOfToppingsSelected - initialToppings.length) * 1.29;

        setSize(newSize);
        setPrice(newPrice);
    };

    const handleAddToCart = async () => {
         // Calculate new total based on toppings
         const salad = {
            type: "Salad",
            size: size,
            dressing: dressing,
            toppings: {
                salad: toppings, // Use toppings for salad
              },
            quantity: quantity,
            price: Number(price), // Convert back to a number
          };

        // Adding pizza to cart
        cartActions.addToCart(salad);
    
        // Clear the selections
        setSize("Large");
        setDressing("Ranch")
        setQuantity(1);
        setToppings([]);
        
        // Set showSuccessMessage to true
        setShowSuccessMessage(true);
    
        // Hide the success message after a few seconds (e.g., 3 seconds)
        setTimeout(() => {
            setShowSuccessMessage(false);
            // Navigate to the pizza menu page
            navigate("../../pizzaMenu");
        }, 1500);
    }
    return (
        <div className='salad-container'>
            {showSuccessMessage && (
              <div className="success-message">Item added to the cart successfully!</div>
            )}
            <Sidebar />
            <div className="salad-content">
                <img className="salad-img" src={GREEKimg} alt="GREEKimg" />
            </div>
            <div className="byo-text">
                <div>
                    Select Your Size
                    <select className="size-select" onChange={handleSizeChange} value={size}>
                        <option value="Large">Large</option>
                        <option value="Small">Small</option>
                    </select>
                </div>
                <div>
                    Select Your Dressing
                    <select className="dressing-select" onChange={handleDressingChange} value={dressing}>
                        <option value="Ranch">Ranch Dressing</option>
                        <option value="Greek">Greek Dressing</option>
                        <option value="Italian">Italian Dressing</option>
                        <option value="Caesar">Caesar Dressing</option>
                    </select>
                </div>
                <div>
                    Quantity
                    <select className="quantity-select" onChange={handleQuantityChange} value={quantity}>
                        {Array.from(Array(20), (x, i) => i + 1).map((option) => (
                        <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <div className='toppings'> Toppings 
                    <div className="label-container">
                        <input
                            type="checkbox"
                            value="Pepperoni"
                            onChange={handleToppingsChange}
                            defaultChecked={toppings.includes("Pepperoni")}
                        />
                        Pepperoni
                    </div>
                    <div className="label-container">
                        <input
                            type="checkbox"
                            value="Ham"
                            onChange={handleToppingsChange}
                            defaultChecked={toppings.includes("Ham")}
                        />
                        Ham
                    </div>
                    <div className="label-container">
                        <input
                            type="checkbox"
                            value="Salmi"
                            onChange={handleToppingsChange}
                            defaultChecked={toppings.includes("Salmi")}
                        />
                        Salmi
                    </div>
                    <div className="label-container">
                        <input
                            type="checkbox"
                            value="Chicken"
                            onChange={handleToppingsChange}
                            defaultChecked={toppings.includes("Chicken")}
                        />
                        Chicken
                    </div>
                    <div className="label-container">
                        <input
                            type="checkbox"
                            value="Mozzarella"
                            onChange={handleToppingsChange}
                            defaultChecked={toppings.includes("Mozzarella")}
                        />
                        Mozzarella
                    </div>
                    <div className="label-container">
                        <input
                            type="checkbox"
                            value="Feta"
                            onChange={handleToppingsChange}
                            defaultChecked={toppings.includes("Feta")}
                        />
                        Feta
                    </div>
                    <div className="label-container">
                        <input
                            type="checkbox"
                            value="Beats"
                            onChange={handleToppingsChange}
                            defaultChecked={toppings.includes("Beats")}
                        />
                        Beats
                    </div>
                    <div className="label-container">
                        <input
                            type="checkbox"
                            value="Pepperoncini"
                            onChange={handleToppingsChange}
                            defaultChecked={toppings.includes("Pepperoncini")}
                        />
                        Pepperoncini
                    </div>
                    <div className="label-container">
                        <input
                            type="checkbox"
                            value="Cheddar"
                            onChange={handleToppingsChange}
                            defaultChecked={toppings.includes("Cheddar")}
                        />
                        Cheddar
                    </div>
                    <div className="label-container">
                        <input
                            type="checkbox"
                            value="Black Olives"
                            onChange={handleToppingsChange}
                            defaultChecked={toppings.includes("Black Olives")}
                        />
                        Black Olives
                    </div>
                    <div className="label-container">
                        <input
                            type="checkbox"
                            value="Greek Olives"
                            onChange={handleToppingsChange}
                            defaultChecked={toppings.includes("Greek Olives")}
                        />
                        Greek Olives
                    </div>
                    <div className="label-container">
                        <input
                            type="checkbox"
                            value="Tomatoes"
                            onChange={handleToppingsChange}
                            defaultChecked={toppings.includes("Tomatoes")}
                        />
                        Tomatoes
                    </div>
                    <div className="label-container">
                        <input
                            type="checkbox"
                            value="Onions"
                            onChange={handleToppingsChange}
                            defaultChecked={toppings.includes("Onions")}
                        />
                        Onions
                    </div>
                    <div className="label-container">
                        <input
                            type="checkbox"
                            value="Green Peppers"
                            onChange={handleToppingsChange}
                            defaultChecked={toppings.includes("Green Peppers")}
                        />
                        Green Peppers
                    </div>
                </div>
                <div className='PriceContainer'>
                    <label className='Price' value={price}>Subtotal: ${(price * quantity).toFixed(2)}</label>
                    <button className='AddToCart' onClick={handleAddToCart}>Add To Cart</button>
                </div>
            </div>
        </div>
    );
}

export default ANTI;