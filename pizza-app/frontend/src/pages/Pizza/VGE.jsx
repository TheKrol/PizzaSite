import React, {useState} from 'react';
import { useNavigate  } from 'react-router-dom';
import Sidebar from '../../components/Sidebar'
import VGEimg from '../../image/VGE.png'
import { useCartActions } from '../../context/CartContext';
import './Pizza.css'

function VGE() {
    const pizzaVariation = 'Specialty5';
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const cartActions = useCartActions(); // Added to access cart manipulation functions
    const navigate = useNavigate();
    const initialToppings = [ "Mushrooms", "Green Peppers", "Onions", "Black Olives", "Tomatoes"]; // Define the initial toppings
    const [toppings, setToppings] = useState(initialToppings);
    const [leftToppings, setLeftToppings] = useState([]); // Added leftToppings state
    const [rightToppings, setRightToppings] = useState([]); // Added rightToppings state
    const [numberOfToppingsSelected, setNumberOfToppingsSelected] = useState(initialToppings.length);
    const [size, setSize] = useState('Large');
    const [crust, setCrust] = useState('Deep Dish');
    const [sauce, setSauce] = useState('Pizza');
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(14.99);

    // Adding all toppings to an array and counting them.
    const handleToppingsChange = (e, position) => {
        const selectedTopping = e.target.value;
        const isChecked = e.target.checked;
    
        // Calculate the change in the number of toppings selected
        let changeInToppings;
    
        if (position === 'full') {
            changeInToppings = isChecked ? 1 : -1;
        } else {
            changeInToppings = isChecked ? 0.5 : -0.5;
        }
    
        // Calculate the new number of toppings selected
        const newNumberOfToppingsSelected = numberOfToppingsSelected + changeInToppings;

        // Define the base prices for different sizes
        const sizePrices = {
            Large: 14.99,
            Medium: 12.99,
            Small: 9.99,
        };
    
        // Get the base price for the selected size
        const basePrice = sizePrices[size];
    
        // Calculate the new price based on the selected size and toppings
        let newPrice = basePrice + Math.ceil(newNumberOfToppingsSelected -initialToppings.length) * 1.29;
    
        // Ensure the price doesn't go below the base price
        if (newPrice < basePrice) {
            newPrice = basePrice;
        }
    
        // Update the state based on the position (full, left, right)
        if (position === 'full') {
            setToppings(isChecked ? [...toppings, selectedTopping] : toppings.filter((topping) => topping !== selectedTopping));
        } else if (position === 'left') {
            setLeftToppings(isChecked ? [...leftToppings, selectedTopping] : leftToppings.filter((topping) => topping !== selectedTopping));
        } else if (position === 'right') {
            setRightToppings(isChecked ? [...rightToppings, selectedTopping] : rightToppings.filter((topping) => topping !== selectedTopping));
        }
    
        setNumberOfToppingsSelected(newNumberOfToppingsSelected);
        setPrice(newPrice);
    };

    const handleSizeChange = (e) => {
        const newSize = e.target.value;
        
        // Define the base prices for different sizes
        const sizePrices = {
            Large: 14.99,
            Medium: 12.99,
            Small: 9.99,
        };
    
        // Calculate the new price based on the selected size
        const newPrice = sizePrices[newSize] + (numberOfToppingsSelected - initialToppings.length) * 1.29;
    
        // Update the state
        setSize(newSize);
        setPrice(newPrice);
    };

    const handleSauceChange = (e) => {
        setSauce(e.target.value);
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const handleCrustChange = (e) => {
        setCrust(e.target.value);
    };

    const handleAddToCart = async () => {
        // Calculate new total based on toppings
        const pizza = {
            type: "Pizza",
            variation: pizzaVariation,
            crust: crust,
            size: size,
            sauce: sauce,
            toppings: {
                full: toppings,
                left: leftToppings,
                right: rightToppings,
            },
            quantity: quantity,
            price: Number(price), // Convert back to a number
        };

        // Adding pizza to cart
        cartActions.addToCart(pizza)
    
        // Clear the selections
        setSize("Large");
        setCrust("Deep Dish");
        setSauce("Pizza");
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
      };

    return (
        <div className="byo-container">
            <Sidebar />
            <div className="byo-content">
                {showSuccessMessage && (
                <div className="success-message">Item added to the cart successfully!</div>
                )}
                <img className="byo-img" src={VGEimg} alt="VGEimg"/>
                <div className="byo-text">
                    <div>
                        Select Your Size
                        <select className="size-select" onChange={handleSizeChange} value={size}>
                            <option value="Large">Large</option>
                            <option value="Medium">Medium</option>
                            <option value="Small">Small</option>
                        </select>
                    </div>
                    <div>
                        Select Your Crust
                        <select className="crust-select" onChange={handleCrustChange} value={crust}>
                            <option value="Round">Round</option>
                            <option value="Deep Dish">Deep Dish</option>
                            <option value="Thin Crust">Thin Crust</option>
                        </select>
                    </div>
                    <div>
                        Select Your Sauce
                        <select className="sauce-select" onChange={handleSauceChange} value={sauce}>
                            <option value="Pizza">Pizza Sauce</option>
                            <option value="BBQ">BBQ Sauce</option>
                            <option value="NoSauce">No Sauce</option>
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
                     {/* Heading for Full, Left, and Right */}
                     <div className="label-container">
                            <div className="checkbox-column">
                                <div className='heading'>Full</div>
                            </div>
                            <div className="checkbox-column">
                                <div className='heading'>Left</div>
                            </div>
                            <div className="checkbox-column">
                                <div className='heading'>Right</div>
                            </div>
                        </div>
                        <div className="meats-container">
                            <div className='meats'> Meats: </div>
                           
                            {/* Pepperoni */}
                            <div className="label-container">
                                <input
                                    type="checkbox"
                                    value="Pepperoni"
                                    onChange={(e) => handleToppingsChange(e, 'full')}
                                    defaultChecked={toppings.includes("Pepperoni")}
                                />
                                <input
                                    type="checkbox"
                                    value="Pepperoni"
                                    onChange={(e) => handleToppingsChange(e, 'left')}
                                    defaultChecked={leftToppings.includes("Pepperoni")}
                                />
                                <input
                                    type="checkbox"
                                    value="Pepperoni"
                                    onChange={(e) => handleToppingsChange(e, 'right')}
                                    defaultChecked={rightToppings.includes("Pepperoni")}
                                />
                                <span className='Topping'>Pepperoni</span>
                            {!toppings.includes("Pepperoni") && (
                                <span className="topping-price">&emsp;${numberOfToppingsSelected >= initialToppings.length ? '1.29' : '0.00'}</span>
                            )}
                            </div>

                            {/* Ham */}
                            <div className="label-container">
                                <input
                                    type="checkbox"
                                    value="Ham"
                                    onChange={(e) => handleToppingsChange(e, 'full')}
                                    defaultChecked={toppings.includes("Ham")}
                                />
                                <input
                                    type="checkbox"
                                    value="Ham"
                                    onChange={(e) => handleToppingsChange(e, 'left')}
                                    defaultChecked={leftToppings.includes("Ham")}
                                />
                                <input
                                    type="checkbox"
                                    value="Ham"
                                    onChange={(e) => handleToppingsChange(e, 'right')}
                                    defaultChecked={rightToppings.includes("Ham")}
                                />
                                <span className='Topping'>Ham</span>
                            {!toppings.includes("Ham") && (
                                <span className="topping-price">&emsp;${numberOfToppingsSelected >= initialToppings.length ? '1.29' : '0.00'}</span>
                            )}
                            </div>

                            {/* Sausage */}
                            <div className="label-container">
                                <input
                                    type="checkbox"
                                    value="Sausage"
                                    onChange={(e) => handleToppingsChange(e, 'full')}
                                    defaultChecked={toppings.includes("Sausage")}
                                />
                                <input
                                    type="checkbox"
                                    value="Sausage"
                                    onChange={(e) => handleToppingsChange(e, 'left')}
                                    defaultChecked={leftToppings.includes("Sausage")}
                                />
                                <input
                                    type="checkbox"
                                    value="Sausage"
                                    onChange={(e) => handleToppingsChange(e, 'right')}
                                    defaultChecked={rightToppings.includes("Sausage")}
                                />
                                <span className='Topping'>Sausage</span>
                            {!toppings.includes("Sausage") && (
                                <span className="topping-price">&emsp;${numberOfToppingsSelected >= initialToppings.length ? '1.29' : '0.00'}</span>
                            )}
                            </div>

                            {/* Bacon */}
                            <div className="label-container">
                                <input
                                    type="checkbox"
                                    value="Bacon"
                                    onChange={(e) => handleToppingsChange(e, 'full')}
                                    defaultChecked={toppings.includes("Bacon")}
                                />
                                <input
                                    type="checkbox"
                                    value="Bacon"
                                    onChange={(e) => handleToppingsChange(e, 'left')}
                                    defaultChecked={leftToppings.includes("Bacon")}
                                />
                                <input
                                    type="checkbox"
                                    value="Bacon"
                                    onChange={(e) => handleToppingsChange(e, 'right')}
                                    defaultChecked={rightToppings.includes("Bacon")}
                                />
                                <span className='Topping'>Bacon</span>
                            {!toppings.includes("Bacon") && (
                                <span className="topping-price">&emsp;${numberOfToppingsSelected >= initialToppings.length ? '1.29' : '0.00'}</span>
                            )}
                            </div>

                            {/* Beef */}
                            <div className="label-container">
                                <input
                                    type="checkbox"
                                    value="Beef"
                                    onChange={(e) => handleToppingsChange(e, 'full')}
                                    defaultChecked={toppings.includes("Beef")}
                                />
                                <input
                                    type="checkbox"
                                    value="Beef"
                                    onChange={(e) => handleToppingsChange(e, 'left')}
                                    defaultChecked={leftToppings.includes("Beef")}
                                />
                                <input
                                    type="checkbox"
                                    value="Beef"
                                    onChange={(e) => handleToppingsChange(e, 'right')}
                                    defaultChecked={rightToppings.includes("Beef")}
                                />
                                <span className='Topping'>Beef</span>
                            {!toppings.includes("Beef") && (
                                <span className="topping-price">&emsp;${numberOfToppingsSelected >= initialToppings.length ? '1.29' : '0.00'}</span>
                            )}
                            </div>

                            {/* Chicken */}
                            <div className="label-container">
                                <input
                                    type="checkbox"
                                    value="Chicken"
                                    onChange={(e) => handleToppingsChange(e, 'full')}
                                    defaultChecked={toppings.includes("Chicken")}
                                />
                                <input
                                    type="checkbox"
                                    value="Chicken"
                                    onChange={(e) => handleToppingsChange(e, 'left')}
                                    defaultChecked={leftToppings.includes("Chicken")}
                                />
                                <input
                                    type="checkbox"
                                    value="Chicken"
                                    onChange={(e) => handleToppingsChange(e, 'right')}
                                    defaultChecked={rightToppings.includes("Chicken")}
                                />
                                <span className='Topping'>Chicken</span>
                            {!toppings.includes("Chicken") && (
                                <span className="topping-price">&emsp;${numberOfToppingsSelected >= initialToppings.length ? '1.29' : '0.00'}</span>
                            )}
                            </div>
                        </div>
                        <div className='veggie'> Veggie: </div>
                            {/* Mushrooms */}
                            <div className="label-container">
                                <input
                                    type="checkbox"
                                    value="Mushrooms"
                                    onChange={(e) => handleToppingsChange(e, 'full')}
                                    defaultChecked={toppings.includes("Mushrooms")}
                                />
                                <input
                                    type="checkbox"
                                    value="Mushrooms"
                                    onChange={(e) => handleToppingsChange(e, 'left')}
                                    defaultChecked={leftToppings.includes("Mushrooms")}
                                />
                                <input
                                    type="checkbox"
                                    value="Mushrooms"
                                    onChange={(e) => handleToppingsChange(e, 'right')}
                                    defaultChecked={rightToppings.includes("Mushrooms")}
                                />
                                <span className='Topping'>Mushrooms</span>
                            {!toppings.includes("Mushrooms") && (
                                <span className="topping-price">&emsp;${numberOfToppingsSelected >= initialToppings.length ? '1.29' : '0.00'}</span>
                            )}
                            </div>

                            {/* Green Peppers */}
                            <div className="label-container">
                                <input
                                    type="checkbox"
                                    value="Green Peppers"
                                    onChange={(e) => handleToppingsChange(e, 'full')}
                                    defaultChecked={toppings.includes("Green Peppers")}
                                />
                                <input
                                    type="checkbox"
                                    value="Green Peppers"
                                    onChange={(e) => handleToppingsChange(e, 'left')}
                                    defaultChecked={leftToppings.includes("Green Peppers")}
                                />
                                <input
                                    type="checkbox"
                                    value="Green Peppers"
                                    onChange={(e) => handleToppingsChange(e, 'right')}
                                    defaultChecked={rightToppings.includes("Green Peppers")}
                                />
                                <span className='Topping'>Green Peppers</span>
                            {!toppings.includes("Green Peppers") && (
                                <span className="topping-price">&emsp;${numberOfToppingsSelected >= initialToppings.length ? '1.29' : '0.00'}</span>
                            )}
                            </div>

                            {/* Onions */}
                            <div className="label-container">
                                <input
                                    type="checkbox"
                                    value="Onions"
                                    onChange={(e) => handleToppingsChange(e, 'full')}
                                    defaultChecked={toppings.includes("Onions")}
                                />
                                <input
                                    type="checkbox"
                                    value="Onions"
                                    onChange={(e) => handleToppingsChange(e, 'left')}
                                    defaultChecked={leftToppings.includes("Onions")}
                                />
                                <input
                                    type="checkbox"
                                    value="Onions"
                                    onChange={(e) => handleToppingsChange(e, 'right')}
                                    defaultChecked={rightToppings.includes("Onions")}
                                />
                                <span className='Topping'>Onions</span>
                            {!toppings.includes("Onions") && (
                                <span className="topping-price">&emsp;${numberOfToppingsSelected >= initialToppings.length ? '1.29' : '0.00'}</span>
                            )}
                            </div>

                            {/* Banana Peppers */}
                            <div className="label-container">
                                <input
                                    type="checkbox"
                                    value="Banana Peppers"
                                    onChange={(e) => handleToppingsChange(e, 'full')}
                                    defaultChecked={toppings.includes("Banana Peppers ")}
                                />
                                <input
                                    type="checkbox"
                                    value="Banana Peppers"
                                    onChange={(e) => handleToppingsChange(e, 'left')}
                                    defaultChecked={leftToppings.includes("Banana Peppers ")}
                                />
                                <input
                                    type="checkbox"
                                    value="Banana Peppers"
                                    onChange={(e) => handleToppingsChange(e, 'right')}
                                    defaultChecked={rightToppings.includes("Banana Peppers ")}
                                />
                                <span className='Topping'>Banana Peppers </span>
                            {!toppings.includes("Banana Peppers") && (
                                <span className="topping-price">&emsp;${numberOfToppingsSelected >= initialToppings.length ? '1.29' : '0.00'}</span>
                            )}
                            </div>

                            {/* Black Olives */}
                            <div className="label-container">
                                <input
                                    type="checkbox"
                                    value="Black Olives"
                                    onChange={(e) => handleToppingsChange(e, 'full')}
                                    defaultChecked={toppings.includes("Black Olives")}
                                />
                                <input
                                    type="checkbox"
                                    value="Black Olives"
                                    onChange={(e) => handleToppingsChange(e, 'left')}
                                    defaultChecked={leftToppings.includes("Black Olives")}
                                />
                                <input
                                    type="checkbox"
                                    value="Black Olives"
                                    onChange={(e) => handleToppingsChange(e, 'right')}
                                    defaultChecked={rightToppings.includes("Black Olives")}
                                />
                                <span className='Topping'>Black Olives</span>
                            {!toppings.includes("Black Olives") && (
                                <span className="topping-price">&emsp;${numberOfToppingsSelected >= initialToppings.length ? '1.29' : '0.00'}</span>
                            )}
                            </div>

                            {/* Tomatoes*/}
                            <div className="label-container">
                                <input
                                    type="checkbox"
                                    value="Tomatoes"
                                    onChange={(e) => handleToppingsChange(e, 'full')}
                                    defaultChecked={toppings.includes("Tomatoes")}
                                />
                                <input
                                    type="checkbox"
                                    value="Tomatoes"
                                    onChange={(e) => handleToppingsChange(e, 'left')}
                                    defaultChecked={leftToppings.includes("Tomatoes")}
                                />
                                <input
                                    type="checkbox"
                                    value="Tomatoes"
                                    onChange={(e) => handleToppingsChange(e, 'right')}
                                    defaultChecked={rightToppings.includes("Tomatoes")}
                                />
                                <span className='Topping'>Tomatoes</span>
                            {!toppings.includes("Tomatoes") && (
                                <span className="topping-price">&emsp;${numberOfToppingsSelected >= initialToppings.length ? '1.29' : '0.00'}</span>
                            )}
                            </div>

                            {/* Pineapple*/}
                            <div className="label-container">
                                <input
                                    type="checkbox"
                                    value="Pineapple"
                                    onChange={(e) => handleToppingsChange(e, 'full')}
                                    defaultChecked={toppings.includes("Pineapple")}
                                />
                                <input
                                    type="checkbox"
                                    value="Pineapple"
                                    onChange={(e) => handleToppingsChange(e, 'left')}
                                    defaultChecked={leftToppings.includes("Pineapple")}
                                />
                                <input
                                    type="checkbox"
                                    value="Pineapple"
                                    onChange={(e) => handleToppingsChange(e, 'right')}
                                    defaultChecked={rightToppings.includes("Pineapple")}
                                />
                                <span className='Topping'>Pineapple</span>
                            {!toppings.includes("Pineapple") && (
                                <span className="topping-price">&emsp;${numberOfToppingsSelected >= initialToppings.length ? '1.29' : '0.00'}</span>
                            )}
                            </div>
                    </div>
                    <div className='PriceContainer'>
                        <label className='Price' value={price}>Subtotal: ${(price * quantity).toFixed(2)}</label>
                        <button className='AddToCart' onClick={handleAddToCart}>Add To Cart</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VGE;