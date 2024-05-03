import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './pizzaMenu.css';
import BYO from '../image/buildyourown.png'
import ABBQ from '../image/ABBQ.png'
import BBQ from '../image/BBQ.png'
import HWN from '../image/HWN.png'
import AMT from '../image/AMT.png'
import VGE from '../image/VGE.png'
import ANTI from '../image/ANTI.png'
import GARDEN from '../image/GARDEN.png'
import GREEK from '../image/GREEK.png'
import Pepsi from '../image/Pepsi.png'
import DietPepsi from '../image/DietPepsi.png'
import MTW from '../image/MTW.png'
import DRPepper from '../image/DRPepper.png'
import Starry from '../image/Starry.png'
import Breadsticks from '../image/Breadsticks.png'
import Chaaprolls from '../image/Chaaprolls.png'
import CinRolls from '../image/CinRolls.png'
import DrinkItem from '../components/DrinkItem';

function PizzaOrderMenu() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { dispatch } = useCart(); // Get the cart context's dispatch function
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(2.99);
  const navigate = useNavigate()
  // Define the topFunction here so it's accessible in the component scope
  function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
  }

  useEffect(() => {
    // Get the button after the component has rendered.
    let mybutton = document.getElementById("myBtn");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () {
      scrollFunction();
    };

    function scrollFunction() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
      } else {
        mybutton.style.display = "none";
      }
    }
  }, []); // Empty dependency array means this effect runs once after the initial render.

  // Showing a button on hover
  // Create state variables for each button
  const [displayBYO, setDisplayBYO] = useState(false)
  const [displayBBQ, setDisplayBBQ] = useState(false)
  const [displayHWN, setDisplayHWN] = useState(false)
  const [displayAMT, setDisplayAMT] = useState(false)
  const [displayVGE, setDisplayVGE] = useState(false)
  const [displayABBQ, setDisplayABBQ] = useState(false)
  const [displayANTI, setDisplayANTI] = useState(false)
  const [displayGARDEN, setDisplayGARDEN] = useState(false)
  const [displayGREEK, setDisplayGREEK] = useState(false)
  const [displayPepsi, setDisplayPepsi] = useState(false)
  const [displayDietPepsi, setDisplayDietPepsi] = useState(false)
  const [displayMTW, setDisplayMTW] = useState(false)
  const [displayDRPepper, setDisplayDRPepper] = useState(false)
  const [displayStarry, setDisplayStarry] = useState(false)
  const [displayBreadsticks, setDisplayBreadsticks] = useState(false)
  const [displayChaaprolls, setDisplayChaaprolls] = useState(false);
  const [displayCinRolls, setDisplayCinRolls] = useState(false)

  //Show Button
  const showButton = (buttonSetter) => {
    buttonSetter(true);
  }
  //Hide Button
  const hideButton = (buttonSetter) => {
    buttonSetter(false);
  }

  //Navigating to the right page
  const navigateOnClick = (buttonName) => {
    switch (buttonName) {
      case 'BYO':
        // Navigate to the Build Your Own page
        navigate("../Pizza/BYO")
        break;
      case 'BBQ':
        // Navigate to the BBQ Chicken page
        navigate("../Pizza/BBQ")
        break;
      case 'HWN':
        // Navigate to the Hawaiian page
        navigate("../Pizza/HWN")
        break;
      case 'AMT':
        // Navigate to the All Meaty page
        navigate("../Pizza/AMT")
        break;
      case 'VGE':
        // Navigate to the Veggie page
        navigate("../Pizza/VGE")
        break;
      case 'ABBQ':
        // Navigate to the BLT page
        navigate("../Pizza/ABBQ")
        break;
      case 'ANTI':
        // Navigate to the antipasto page
        navigate("../Salad/ANTI")
        break;
      case 'GREEK':
        // Navigate to the greek page
        navigate("../Salad/GREEK")
        break;
      case 'GARDEN':
        // Navigate to the garden page
        navigate("../Salad/GARDEN")
        break;
      default:
        console.log("Button action not defined");
    }
  };

  // Add item to cart
  const addToCart = (name) => {
    let updatedPrice = price; // Default price

    if (name === "Breadsticks") {
      updatedPrice = 5.99; // Update the price for Breadsticks
    }
    if (name === "Chaaprolls") {
      updatedPrice = 4.99; // Update the price for Chaaprolls
    }

    if (name === "CinRolls") {
      updatedPrice = 4.99;
    }

    // Create an object with the item's details (quantity, price, etc.)
    const newItem = {
      type: name === "Breadsticks" || name === 'CinRolls' || name === 'Chaaprolls' ? "Sides" : "Drink",
      name: name, // Add the name of the item
      quantity: quantity, // Add the selected quantity
      price: updatedPrice, // Use the updated price
    };

    // Dispatch an action to add the item to the cart
    dispatch({ type: 'ADD_TO_CART', payload: newItem });

    // Reset quantity and set the default price
    setQuantity(1);
    setPrice(2.99);

    // Set showSuccessMessage to true
    setShowSuccessMessage(true);

    // Hide the success message after a few seconds (e.g., 3 seconds)
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 1500);
  }

  const onclick = (e, buttonName) => {
    e.preventDefault();
    navigateOnClick(buttonName);
  };

  return (
    <div className='menu-box'>
      <Sidebar />
      {showSuccessMessage && (
        <div className="success-message">Item added to the cart successfully!</div>
      )}
      <div className='Menu-Container'>
        <Navbar />
        <div className='Menu-item-container'>
          <div id='Pizza' className='Pizza'></div>
          <div className='Pizza-items'>
            <div className='Pizza-item'>
              <img className='Pizza-img' src={BYO} alt="BYO" onMouseEnter={() => showButton(setDisplayBYO)}
                onMouseLeave={() => hideButton(setDisplayBYO)} />
              <button onMouseEnter={() => showButton(setDisplayBYO)} className={displayBYO ? 'displayed' : 'notdisplayed'}
                onClick={(e) => onclick(e, 'BYO')} >
                Customize
              </button>
              <p className='Pizza-text'>Build Your Own</p>
            </div>
            <div className='Pizza-item'>
              <img className='Pizza-img' src={BBQ} alt="BBQ" onMouseEnter={() => showButton(setDisplayBBQ)}
                onMouseLeave={() => hideButton(setDisplayBBQ)} />
              <button onMouseEnter={() => showButton(setDisplayBBQ)} className={displayBBQ ? 'displayed' : 'notdisplayed'}
                onClick={(e) => onclick(e, 'BBQ')}>
                Customize
              </button>
              <p className='Pizza-text'>BBQ Chicken</p>
            </div>
            <div className='Pizza-item'>
              <img className='Pizza-img' src={HWN} alt="HWN" onMouseEnter={() => showButton(setDisplayHWN)}
                onMouseLeave={() => hideButton(setDisplayHWN)} />
              <button onMouseEnter={() => showButton(setDisplayHWN)} className={displayHWN ? 'displayed' : 'notdisplayed'}
                onClick={(e) => onclick(e, 'HWN')}>
                Customize
              </button>
              <p className='Pizza-text'>Hawaiian</p>
            </div>
          </div>
          <div className='Pizza-items'>
            <div className='Pizza-item'>
              <img className='Pizza-img' src={AMT} alt="AMT" onMouseEnter={() => showButton(setDisplayAMT)}
                onMouseLeave={() => hideButton(setDisplayAMT)} />
              <button onMouseEnter={() => showButton(setDisplayAMT)} className={displayAMT ? 'displayed' : 'notdisplayed'}
                onClick={(e) => onclick(e, 'AMT')}>
                Customize
              </button>
              <p className='Pizza-text'>All Meaty</p>
            </div>
            <div className='Pizza-item'>
              <img className='Pizza-img' src={VGE} alt="VGE" onMouseEnter={() => showButton(setDisplayVGE)}
                onMouseLeave={() => hideButton(setDisplayVGE)} />
              <button onMouseEnter={() => showButton(setDisplayVGE)} className={displayVGE ? 'displayed' : 'notdisplayed'}
                onClick={(e) => onclick(e, 'VGE')}>
                Customize
              </button>
              <p className='Pizza-text'>Veggie</p>
            </div>
            <div className='Pizza-item'>
              <img className='Pizza-img' src={ABBQ} alt="ABBQ" onMouseEnter={() => showButton(setDisplayABBQ)}
                onMouseLeave={() => hideButton(setDisplayABBQ)} />
              <button onMouseEnter={() => showButton(setDisplayABBQ)} className={displayABBQ ? 'displayed' : 'notdisplayed'}
                onClick={(e) => onclick(e, 'ABBQ')}>
                Customize
              </button>
              <p className='Pizza-text'>Aloha BBQ Chicken</p>
            </div>
          </div>
          <div id='Salad' className='Salad'></div>
          <div className='Salad-items'>
            <div className='Salad-item'>
              <img className='Salad-img' src={ANTI} alt="ANTI" onMouseEnter={() => showButton(setDisplayANTI)}
                onMouseLeave={() => hideButton(setDisplayANTI)} />
              <button onMouseEnter={() => showButton(setDisplayANTI)} className={displayANTI ? 'displayed' : 'notdisplayed'}
                onClick={(e) => onclick(e, 'ANTI')}>
                Customize
              </button>
              <p className='Salad-text'>Antipasto Salad</p>
            </div>
            <div className='Salad-item'>
              <img className='Salad-img' src={GARDEN} alt="GARDEN" onMouseEnter={() => showButton(setDisplayGARDEN)}
                onMouseLeave={() => hideButton(setDisplayGARDEN)} />
              <button onMouseEnter={() => showButton(setDisplayGARDEN)} className={displayGARDEN ? 'displayed' : 'notdisplayed'}
                onClick={(e) => onclick(e, 'GARDEN')}>
                Customize
              </button>
              <p className='Salad-text'>Garden Salad</p>
            </div>
            <div className='Salad-item'>
              <img className='Salad-img' src={GREEK} alt="GREEK" onMouseEnter={() => showButton(setDisplayGREEK)}
                onMouseLeave={() => hideButton(setDisplayGREEK)} />
              <button onMouseEnter={() => showButton(setDisplayGREEK)} className={displayGREEK ? 'displayed' : 'notdisplayed'}
                onClick={(e) => onclick(e, 'GREEK')}>
                Customize
              </button>
              <p className='Salad-text'>Greek Salad</p>
            </div>
          </div>
          <div id='Sides' className='Sides'></div>
          <div className='Sides-items'>
            <div className='Sides-item'>
              <img
                className='Sides-img'
                src={Breadsticks}
                alt="Breadsticks"
                onMouseEnter={() => showButton(setDisplayBreadsticks)}
                onMouseLeave={() => hideButton(setDisplayBreadsticks)}
              />
              {displayBreadsticks && (
                <div className='Side-text' onMouseEnter={() => showButton(setDisplayBreadsticks)}>
                  <div className='row'>
                    <span>Quantity: </span>
                    <select
                      value={quantity} // Set the selected quantity
                      onChange={(e) => setQuantity(e.target.value)}
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='row'>
                    <span>Price: $5.99</span>
                  </div>
                  <div className='row'>
                    <button
                      onMouseEnter={() => showButton(setDisplayBreadsticks)}
                      onMouseLeave={() => hideButton(setDisplayBreadsticks)}
                      className={displayBreadsticks ? 'displayedSides' : 'notdisplayedSides'}
                      onClick={() => addToCart("Breadsticks")}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}
              <p className='Sides-text'>Breadsticks</p>
            </div>
            <div className='Sides-item'>
              <img
                className='Sides-img'
                src={CinRolls}
                alt="CinRolls"
                onMouseEnter={() => showButton(setDisplayCinRolls)}
                onMouseLeave={() => hideButton(setDisplayCinRolls)}
              />
              {displayCinRolls && (
                <div className='Side-text' onMouseEnter={() => showButton(setDisplayCinRolls)}>
                  <div className='row'>
                    <span>Quantity: </span>
                    <select
                      value={quantity} // Set the selected quantity
                      onChange={(e) => setQuantity(e.target.value)}
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='row'>
                    <span>Price: $4.99</span>
                  </div>
                  <div className='row'>
                    <button
                      onMouseEnter={() => showButton(setDisplayCinRolls)}
                      onMouseLeave={() => hideButton(setDisplayCinRolls)}
                      className={displayCinRolls ? 'displayedSides' : 'notdisplayedSides'}
                      onClick={() => addToCart("CinRolls")}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}
              <p className='Sides-text'>Cinnamon Rolls</p>
            </div>
            <div className='Sides-item'>
            <img
                className='Sides-img'
                src={Chaaprolls}
                alt="Chaaprools"
                onMouseEnter={() => showButton(setDisplayChaaprolls)}
                onMouseLeave={() => hideButton(setDisplayChaaprolls)}
              />
              {displayChaaprolls && (
                <div className='Side-text' onMouseEnter={() => showButton(setDisplayChaaprolls)}>
                  <div className='row'>
                    <span>Quantity: </span>
                    <select
                      value={quantity} // Set the selected quantity
                      onChange={(e) => setQuantity(e.target.value)}
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='row'>
                    <span>Price: $4.99</span>
                  </div>
                  <div className='row'>
                    <button
                      onMouseEnter={() => showButton(setDisplayChaaprolls)}
                      onMouseLeave={() => hideButton(setDisplayChaaprolls)}
                      className={displayChaaprolls ? 'displayedSides' : 'notdisplayedSides'}
                      onClick={() => addToCart("Chaaprolls")}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}
              <p className='Sides-text'>Chaap Rolls</p>
            </div>
            </div>
          </div>
          <div id='Drink' className='Drink'></div>
          <div className='Drink-items'>
            <DrinkItem
              imgSrc={Pepsi}
              drinkName="Pepsi"
              displayState={displayPepsi}
              showButton={setDisplayPepsi}
              hideButton={setDisplayPepsi}
              quantity={quantity}
              setQuantity={setQuantity}
              price={2.99}
              addToCart={addToCart}
            />
            <DrinkItem
              imgSrc={DietPepsi}
              drinkName="DietPepsi"
              displayState={displayDietPepsi}
              showButton={setDisplayDietPepsi}
              hideButton={setDisplayDietPepsi}
              quantity={quantity}
              setQuantity={setQuantity}
              price={2.99}
              addToCart={addToCart}
            />
            <DrinkItem
              imgSrc={MTW}
              drinkName="MTW"
              displayState={displayMTW}
              showButton={setDisplayMTW}
              hideButton={setDisplayMTW}
              quantity={quantity}
              setQuantity={setQuantity}
              price={2.99}
              addToCart={addToCart}
            />
            <DrinkItem
              imgSrc={DRPepper}
              drinkName="Dr. Pepper"
              displayState={displayDRPepper}
              showButton={setDisplayDRPepper}
              hideButton={setDisplayDRPepper}
              quantity={quantity}
              setQuantity={setQuantity}
              price={2.99}
              addToCart={addToCart}
            />
            <DrinkItem
              imgSrc={Starry}
              drinkName="Starry"
              displayState={displayStarry}
              showButton={setDisplayStarry}
              hideButton={setDisplayStarry}
              quantity={quantity}
              setQuantity={setQuantity}
              price={2.99}
              addToCart={addToCart}
            />
          </div>
          <button onClick={topFunction} id="myBtn" title="Go to top">Top</button>
        </div>
      </div>
    
  );
}

export default PizzaOrderMenu;