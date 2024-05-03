import React from 'react';

const DrinkItem = ({ imgSrc, drinkName, displayState, showButton, hideButton, quantity, setQuantity, price, addToCart }) => {
  return (
    <div className='Drink-item'>
      <img
        className='Drink-img'
        src={imgSrc}
        alt={drinkName}
        onMouseEnter={() => showButton(true)}
        onMouseLeave={() => hideButton(false)}
      />
      {displayState && (
        <div className='Drink-text' onMouseEnter={() => showButton(true)}>
          <div className='row'>
            <span>Quantity: </span>
            <select
              value={quantity}
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
            <span>Price: ${price.toFixed(2)}</span>
          </div>
          <div className='row'>
            <button
              onMouseEnter={() => showButton(true)}
              onMouseLeave={() => hideButton(false)}
              className={displayState ? 'displayedDrink' : 'notdisplayedDrink'}
              onClick={() => addToCart(drinkName)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
      <p className='Drinks-text'>{drinkName}</p>
    </div>
  );
};

export default DrinkItem;