import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { useCartActions } from '../context/CartContext';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const [orderData, setOrderData] = useState(null);
  const cartActions = useCartActions();

  //Clears out the cart
  //Input: Cart contents
  //Output: Empty cart
  const clearCart = () => {
    cartActions.clearCart();
  };

  //Gets the order the user placed from the database upon the page loading
  //Input: Page loads in
  //Output: User order or an error if no data is present
  useEffect(() => {
    clearCart();
    axios.get('http://localhost:3001/order')
      .then(response => {
        setOrderData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  //Function that is used to display the date and time the order was placed
  //Input: Unformatted date & time the order was placed
  //Output: Formatted date and time
  const formatDateTime = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleString([], options);
  };


  //Function that calculates the order total price including tax (6% tax rate only)
  //Input: The price of each item that the user ordered
  //Output: The total price of what the user paid including tax
  const totalOrderPrice = () => {
    if (orderData && orderData.length > 0) {
      const subtotal = orderData[orderData.length - 1].items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
      const taxRate = 0.06;
      const tax = subtotal * taxRate;
      return (subtotal + tax).toFixed(2);
    }
    return 0;
  };

  return (
    <div className='order-confirm-box'>
      <Sidebar />
      <div className='order-confirm-container'>
        <div className='form-item-add'>
          <div className='order-add-inv'>Order Placed!</div>
          {orderData && orderData.length > 0 && (
            <div>
              <p>Email: {orderData[orderData.length - 1].email}</p>
              <p>Order Type: {orderData[orderData.length - 1].orderType}</p>
              <p>Order Note: {orderData[orderData.length - 1].orderNote}</p>
              <p>Order Date: {formatDateTime(orderData[orderData.length - 1].updatedAt)}</p>
              <p>Order Total: ${(parseFloat(totalOrderPrice())).toFixed(2)}</p>
              <div className='order-items'>
                <h2>Items:</h2>
                <div className='order-item-2'>
                  <ul>
                    {orderData[orderData.length - 1].items.map((item, index) => (
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
                            {item.toppings && item.toppings.left && item.toppings.left.length > 0 && (
                              <>
                                  &nbsp;&nbsp;Left: {item.toppings.left.join(', ')}
                                <br />
                              </>
                            )}
                            {item.toppings && item.toppings.right && item.toppings.right.length > 0 && (
                              <>
                                  &nbsp;&nbsp;Right: {item.toppings.right.join(', ')}
                                <br />
                              </>
                            )}
                            {item.toppings && item.toppings.full && item.toppings.full.length > 0 && (
                              <>
                                  &nbsp;&nbsp;Full: {item.toppings.full.join(', ')}
                                <br />
                              </>
                            )}
                          </p>
                            <p>Price: ${item.price.toFixed(2)}</p>
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
                            <p>Price: ${item.price.toFixed(2)}</p>
                          </>
                        )}
                        {item.type === 'Drink' && (
                          <>
                            <p>Name: {item.name}</p>
                            <p>Price: ${item.price.toFixed(2)}</p>
                          </>
                        )}
                        {item.type === 'Sides' && (
                          <>
                            <p>Name: {item.name}</p>
                            <p>Price: ${item.price.toFixed(2)}</p>
                          </>
                        )}
                        <p>Quantity: {item.quantity}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;