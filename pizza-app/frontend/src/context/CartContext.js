import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define the initial state of the cart
const initialCartState = {
  items: [],
};

function generateUniqueId() {
  return uuidv4();
}

// Create a context
export const CartContext = createContext();

// Create a custom hook to access the cart context
export function useCart() {
  return useContext(CartContext);
}

// Create a custom hook to access cart actions
export function useCartActions() {
  const { dispatch } = useContext(CartContext);

  // Define functions for cart actions
  const addToCart = (item) => {
    const newItem = { ...item, id: generateUniqueId() };
    dispatch({ type: 'ADD_TO_CART', payload: newItem });
  };

  const removeItem = (index) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: index });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const updateQuantity = (item, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { item, quantity } });
  };

  const updateCrust = (item, newCrust) => {
    // Ensure 'id' is present in the item before dispatching the action
    dispatch({ type: 'UPDATE_CRUST', payload: { item, newCrust } });
  };

  const updateSize = (itemSize, newSize) => {
    dispatch({ type: 'UPDATE_SIZE', payload: { itemSize, newSize } });
  };

  const updateDressing = (item, newDressing) => {
    dispatch({ type: 'UPDATE_DRESSING', payload: { item, newDressing } });
  };

  return { addToCart, removeItem, clearCart, updateQuantity, updateCrust, updateSize, updateDressing };
}

// Create a CartProvider component to wrap your app
export function CartProvider({ children }) {
  // Load cart state from localStorage or use initial state
  const [cart, dispatch] = useReducer(cartReducer, loadCartState() || initialCartState);

  // Save cart state to localStorage whenever it changes
  useEffect(() => {
    saveCartState(cart);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

// Define a cartReducer function to handle cart actions (e.g., add to cart, remove from cart)
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      // Implement the logic to add items to the cart
      const updatedItemsAdd = [...state.items, action.payload];
      return {
        ...state,
        items: updatedItemsAdd,
      };
    case 'REMOVE_FROM_CART':
      // Implement the logic to remove items from the cart
      const updatedItemsRemove = state.items.filter((item, index) => index !== action.payload);
      return {
        ...state,
        items: updatedItemsRemove,
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    case 'UPDATE_QUANTITY':
      // Find the item you want to update in the cart
      const itemToUpdate = state.items.find((item) => item.id === action.payload.item.id);
    
      if (itemToUpdate) {
        // Create a copy of the updated item with the new quantity
        const updatedItem = {
          ...itemToUpdate,
          quantity: action.payload.quantity,
        };
    
        // Find the index of the item to update in the cart
        const itemIndex = state.items.indexOf(itemToUpdate);
    
        // Create a new array with the updated item
        const updatedItems = [...state.items];
        updatedItems[itemIndex] = updatedItem;
    
        return {
          ...state,
          items: updatedItems,
        };
      };
    case 'UPDATE_CRUST':
      const newCrust = action.payload.newCrust;
      const updatedItemsCrust = state.items.map((item) => {          
        if (item === action.payload.item){
          if (item.type === 'Pizza') {
            // Only update the crust for the specific pizza item
            return {
              ...item,
              crust: newCrust,
            };
          }
        }
          return item;
        });
      return {
        ...state,
        items: updatedItemsCrust,
      };
    case 'UPDATE_SIZE':
      const newSize = action.payload.newSize;
      const updatedItemsSize = state.items.map((item) => {
        // Specify the id of the item you want to update
        if (item.id === action.payload.itemSize.id) {
          console.log("True");
          if (item.type === 'Pizza') {
            // Only update the size and re-calculate the price for pizza items
            let price = 0;
            if (item.variation === 'Specialty3') {
              price = calculateSpecialtyPizzaPrice3(newSize, item.toppings.length);
            } else if (item.variation === 'Specialty5') {
              price = calculateSpecialtyPizzaPrice5(newSize, item.toppings.length);
            } else if (item.variation === 'BYO') {
              price = calculateBYOPrice(newSize, item.toppings);
            }
    
            // Update the item with the new size and price
            return {
              ...item,
              size: newSize,
              price,
            };
          } else if (item.type === 'Salad') {
            // Update the size and re-calculate the price for salad
            let saladPrice = 0;
            if (newSize === 'Large') {
              saladPrice = 9.99;
            } else if (newSize === 'Small') {
              saladPrice = 7.99;
            }
            if (item.toppings.length > 5) {
              saladPrice += (item.toppings.length - 5) * 1.29;
            }
    
            // Update the item with the new size and price
            return {
              ...item,
              size: newSize,
              price: saladPrice,
            };
          }
        }
        return item;
      });
    
  
    return {
      ...state,
      items: updatedItemsSize,
    };
    case 'UPDATE_DRESSING':
      const newDressing = action.payload.newDressing;
      const updatedItemsDressing = state.items.map((item) => {
        if (item.id === action.payload.item.id) {
          if (item.type === 'Salad') {
            // Only update the dressing for the specific salad item
            return {
              ...item,
              dressing: newDressing,
            };
          }
        }
        return item;
      });

      return {
        ...state,
        items: updatedItemsDressing,
      };  
    default:
      return state;
    }

            
  }

// Helper function to load cart state from localStorage
function loadCartState() {
  const savedState = localStorage.getItem('cartState');
  return savedState ? JSON.parse(savedState) : null;
}

// Helper function to save cart state to localStorage
function saveCartState(cartState) {
  localStorage.setItem('cartState', JSON.stringify(cartState));
}

// Helper function for calculating a new pice of 3 topping Specialty
function calculateSpecialtyPizzaPrice3(newSize, numToppings) {
  const basePrices = {
    Large: 14.99,
    Medium: 12.99,
    Small: 9.99,
  };

  let price = basePrices[newSize];

  if (numToppings > 3) {
    price += (numToppings - 3) * 1.29;
  }

  return price;
}

// Helper function for calculating a new pice of 5 topping Specialty
function calculateSpecialtyPizzaPrice5(newSize, numToppings) {
  const basePrices = {
    Large: 14.99,
    Medium: 12.99,
    Small: 9.99,
  };

  let price = basePrices[newSize];

  if (numToppings > 5) {
    price += (numToppings - 5) * 1.29;
  }

  return price;
}

// Helper function for calculating a new pice of Build your own
function calculateBYOPrice(newSize, numToppings) {
  const basePrices = {
    Large: 10.99,
    Medium: 8.99,
    Small: 6.99,
  };

  let price = basePrices[newSize];

  if (numToppings > 1) {
    price += (numToppings - 1) * 1.29;
  }

  return price;
}