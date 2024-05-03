/* global itemPriceMap */
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { useCart, useCartActions } from '../context/CartContext';
import { addCartToDatabase } from '../hooks/useCartData';
import { PatternFormat } from 'react-number-format';
import { useProfile } from '../hooks/useProfile';
import { AuthContext } from '../context/AuthContext'
import '../pages/orderCart.css'

const OrderCart = () => {
  const { user } = useContext(AuthContext);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const { cart } = useCart();
  const cartActions = useCartActions(); // Added to access cart manipulation functions
  const [orderType, setOrderType] = useState('pickup'); // Default to 'delivery'
  const { profile } = useProfile()
  const [orderNote, setOrderNote] = useState('');
  // Create the user
  const [User, setUser] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    dob: ''
  });

  // Handling edit changes
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCrust, setEditCrust] = useState('');
  const [editSize, setEditSize] = useState('');
  const [editDressing, setEditDressing] = useState('');


  // Handle change of the user
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...User, [name]: value });
  };

  const handleOrderTypeChange = (value) => {
    setOrderType(value);
  };

  // Getting any profile if it already exists in the database
  const fetchUserProfile = async (email) => {
    try {
      const response = await axios.get(`http://localhost:3001/user/profile/${encodeURIComponent(email)}`);
      return response.data; // Assuming the response contains user profile data
    } catch (error) {
      throw error;
    }
  };

  // Fetch the user's existing data when the page loads
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const existingUserData = await fetchUserProfile(user.email);
        setUser(existingUserData); // Update the User state with the fetched data
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (user) {
      fetchExistingData();
    }
  }, [user]);

  const calculateSubtotal = () => {
    return cart.items.reduce((total, item) => {
      const itemPrice = Number(item.price) || 0;
      const itemQuantity = Number(item.quantity) || 1; // Assuming quantity defaults to 1 if not provided
      return total + (itemPrice * itemQuantity);
    }, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const taxRate = 0.06;
    return subtotal * taxRate;
  };

  const calculateTotalPriceWithTax = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    return subtotal + tax;
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      // Redirect to the login page with the source location in the state.
      navigate('/login', { state: { sourceLocation: 'orderCart', message: 'Please log in before placing an order' } });
      return;
    }

    const email = user.email;
    if (cart.items.length === 0) {
      // Throw an error if the cart is empty
      alert('Please add items to your cart before placing an order.');
      return;
    }

    if (orderType === 'delivery' && (!User.address)) {
      alert('Please provide a delivery address before placing an order.');
      return;
    }

    // Check for required user fields
    if (!User.firstName || !User.phone) {
      alert('Please complete all required user information before placing an order.');
      return;
    }

    // Validate phone length
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (!phoneRegex.test(User.phone) || User.phone.replace(/\D/g, '').length !== 10) {
      alert('Please provide a valid 10-digit phone number.');
      return;
    }

    try {
      const orderItems = cart.items.map((item) => {
        const orderItem = {
          type: item.type,
          variation: item.pizzaVariation,
          size: item.size,
          crust: item.crust,
          sauce: item.sauce,
          quantity: item.quantity,
          price: item.price,
        };

        // Check if the toppings are pizza type and have left, right, and full toppings
        if (item.type === 'Pizza' && item.toppings) {
          const { full, left, right } = item.toppings;

          // Include half and half toppings in the orderItem object
          orderItem.toppings = {
            full: full ? full.join(', ') : '',
            left: left ? left.join(', ') : '',
            right: right ? right.join(', ') : '',
          };
        } else if (item.type === 'Salad' && item.toppings) {
          // Include salad toppings and dressing in the orderItem object
          const { salad } = item.toppings;
          orderItem.toppings = {
            salad: salad ? salad.join(', ') : '',
          };
          orderItem.dressing = item.dressing || '';
        } else if (item.type === 'Drink') {
          // Include drink name in the orderItem object
          orderItem.name = item.name;
        } else if (item.type === 'Sides') {
          // Include sides name in the orderItem object
          orderItem.name = item.name;
        }

        return orderItem;
      });


      // Use fetch to connect to the create-checkout-session endpoint
      try {
        const response = await axios.post(`http://localhost:3001/stripe/create-checkout-session`, {
          orderItems,
          email,
          orderType,
          orderNote,
        });

        console.log('Server response:', response);

        if (response.data.url) {
          window.location.href = response.data.url;
        } else {
          console.error('Invalid response format:', response);
        }
      } catch (error) {
        console.error('Error during request:', error);

        // Log the error response if available
        if (error.response) {
          console.error('Server response data:', error.response.data);
          console.error('Server response status:', error.response.status);
          console.error('Server response headers:', error.response.headers);
        }
        return;
      }

      await addCartToDatabase(orderItems, email, orderType, orderNote);
      await profile(user.email, User.firstName, User.lastName, User.phone, User.address, User.dob)


    } catch (error) {
      console.error('Error in handlePlaceOrder:', error);
    }
  };

  const handleDeleteItem = (index) => {
    cartActions.removeItem(index);
  };

  // Handling edit
  const handleEditItem = (index) => {
    setEditingItemIndex(index);
    setEditQuantity(cart.items[index].quantity);
    setEditSize(cart.items[index].size);

    const currentItem = cart.items[index];
    if (currentItem.type === 'Pizza') {
      setEditCrust(currentItem.crust);
    } else if (currentItem.type === 'Salad') {
      setEditDressing(currentItem.dressing);
    } else {
      setEditCrust(''); // Reset to an empty string if it's not a pizza or salad
    }

    setIsEditModalOpen(true);
  };

  // Handle submit in edit
  const handleEditSubmit = () => {
    if (editingItemIndex !== null) {
      const updatedCart = [...cart.items];
      updatedCart[editingItemIndex].quantity = editQuantity;
      const editedItem = updatedCart[editingItemIndex]; // Get the item being edited

      if (editedItem.type === 'Pizza') {
        // Only update the crust for pizza items
        cartActions.updateCrust(editedItem, editCrust);
      } else if (editedItem.type === 'Salad') {
        // Update the dressing for salad items
        cartActions.updateDressing(editedItem, editDressing);
      }

      cartActions.updateSize(editedItem, editSize);

      setIsEditModalOpen(false); // Close the edit modal
    }
  };

  // Handle edit cancel
  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  return (
    <div className="order-cart-container">
      <Sidebar />
      <div className="order-type-container">
        <div className="order-type-radio">
          <label className="order-type-label">
            <input
              type="radio"
              value="pickup"
              checked={orderType === 'pickup'}
              onChange={() => handleOrderTypeChange('pickup')}
            />
            Pickup
          </label>
        </div>
        <div className="order-type-radio">
          <label className="order-type-label">
            <input
              type="radio"
              value="delivery"
              checked={orderType === 'delivery'}
              onChange={() => handleOrderTypeChange('delivery')}
            />
            Delivery
          </label>
        </div>
        {orderType === 'pickup' && (
          <div className='order-inputs'>
            <input
              type="text"
              required
              className="order-input"
              placeholder="First Name"
              name="firstName"
              value={User.firstName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="order-input"
              placeholder="Last Name"
              name="lastName"
              value={User.lastName}
              onChange={handleInputChange}
            />
            <PatternFormat
              className='order-input'
              name="phone"
              required
              format="(###) ###-####"
              placeholder="Phone"
              value={User.phone}
              onChange={handleInputChange}
            />
          </div>
        )}
        {orderType === 'delivery' && (
          <div className='order-inputs'>
            <input
              type="text"
              required
              className="order-input"
              name="firstName"
              placeholder="First Name"
              value={User.firstName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="order-input"
              name="lastName"
              placeholder="Last Name"
              value={User.lastName}
              onChange={handleInputChange}
            />
            <PatternFormat
              name="phone"
              className="order-input"
              required
              format="(###) ###-####"
              placeholder="Phone"
              value={User.phone}
              onChange={handleInputChange}
            />
            <input
              type="text"
              required
              className="order-input"
              name="address"
              placeholder="Address"
              value={User.address}
              onChange={handleInputChange}
            />
          </div>
        )}
        <div className='order-inputs'>
          <textarea
            className="note-input"
            name="orderNote"
            placeholder="Order Note (250 characters max)"
            maxLength={250}
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
          />
          <p className='Note-Text'>You can't write no more than  {250 - orderNote.length}  characters</p>
        </div>
      </div>
      <div className="main-content">
        {showSuccessMessage && (
          <div className="success-message">Order Placed</div>
        )}
        <h3 className='Note-Text'>Cart</h3>
        <ul className='cart-contents'>
          {cart.items.map((item, index) => (
            <li key={index}>
              <h3>
                {item.type === 'Pizza'
                  ? 'Pizza Details:'
                  : item.type === 'Salad'
                    ? 'Salad Details:'
                    : item.type === 'Sides'
                      ? 'Sides Details:'
                      : 'Drink Details:'}
              </h3>
              {item.type === 'Pizza' && (
                <>
                  <p>Size: {item.size}</p>
                  <p>Crust: {item.crust}</p>
                  <p>Sauce: {item.sauce}</p>
                  <p>Toppings:<br />
                    {item.toppings.left?.length > 0 && (
                      <>
                        &nbsp;&nbsp;Left: {item.toppings.left.join(', ')}
                        <br />
                      </>
                    )}
                    {item.toppings.right?.length > 0 && (
                      <>
                        &nbsp;&nbsp;Right: {item.toppings.right.join(', ')}
                        <br />
                      </>
                    )}
                    {item.toppings.full?.length > 0 && (
                      <>
                        &nbsp;&nbsp;Full: {item.toppings.full.join(', ')}
                        <br />
                      </>
                    )}
                  </p>
                </>
              )}
              {item.type === 'Salad' && (
                <>
                  <p>Size: {item.size}</p>
                  <p>Dressing: {item.dressing}</p>
                  {item.toppings && item.toppings.salad && (
                    <p>
                      Toppings: {item.toppings.salad.join(', ')}
                    </p>
                  )}
                  <p>Price: {item.price.toFixed(2)}</p>
                </>
              )}
              {item.type === 'Drink' && (
                <>
                  <p>Name: {item.name}</p>
                  <p>Price: {item.price.toFixed(2)}</p>
                </>
              )}
              {item.type === 'Sides' && (
                <>
                  <p>Name: {item.name}</p>
                  <p>Price: {item.price.toFixed(2)}</p>
                </>
              )}
              <p>Quantity: {item.quantity}</p>
              {/* "Edit" button to modify item */}
              <button className="menu-edit-button" onClick={() => handleEditItem(index)}>Edit</button>
              {/* "Delete" button to remove an item from the cart */}
              <button className="menu-delete-button" onClick={() => handleDeleteItem(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {!isEditModalOpen && (
        <div className='order-price'>
          {/* Display subtotal */}
          <h3>Subtotal:</h3>
          <p>${calculateSubtotal().toFixed(2)}</p>

          {/* Display tax */}
          <h3>Tax (6%):</h3>
          <p>${calculateTax().toFixed(2)}</p>

          {/* Display the total price with tax */}
          <h3>Total Price with Tax:</h3>
          <p>${calculateTotalPriceWithTax().toFixed(2)}</p>

          {/* "Place Order" button */}
          <button className="place-order-button" onClick={handlePlaceOrder}>Place Order</button>
        </div>
      )}
      {isEditModalOpen && (
        <div className="edit-modal">
          <strong>Quantity:</strong>
          <input
            type="number"
            value={editQuantity}
            onChange={(e) => {
              // Ensure the value is within the range [0, 20]
              const newValue = Math.min(20, Math.max(1, parseInt(e.target.value, 10)));
              setEditQuantity(newValue);
            }}
          />
          {cart.items[editingItemIndex].type === 'Pizza' && (
            <>
              <strong>Size:</strong>
              <select
                value={editSize}
                onChange={(e) => setEditSize(e.target.value)}
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
              <strong>Crust:</strong>
              <select
                value={editCrust}
                onChange={(e) => setEditCrust(e.target.value)}
              >
                <option value="Deep Dish">Deep Dish</option>
                <option value="Thin Crust">Thin Crust</option>
                <option value="Round">Round</option>
              </select>
            </>
          )}
          {cart.items[editingItemIndex].type === 'Salad' && (
            <>
              <strong>Size:</strong>
              <select
                value={editSize}
                onChange={(e) => setEditSize(e.target.value)}
              >
                <option value="Small">Small</option>
                <option value="Large">Large</option>
              </select>
              <strong>Dressing:</strong>
              <select
                value={editDressing}
                onChange={(e) => setEditDressing(e.target.value)}
              >
                <option value="Ranch">Ranch Dressing</option>
                <option value="Greek">Greek Dressing</option>
                <option value="Italian">Italian Dressing</option>
                <option value="Caesar">Caesar Dressing</option>
              </select>
            </>
          )}

          <button className="edit-modal-button1" onClick={handleEditSubmit}>Save</button>
          <button className="edit-modal-button2" onClick={handleEditCancel}>Cancel</button>

        </div>
      )}
    </div>
  );
};

export default OrderCart;