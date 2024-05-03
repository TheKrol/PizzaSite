export async function addCartToDatabase(orderItems, email, orderType, orderNote) {
  try {
    const apiUrl = 'http://localhost:3001/order/add'; // Replace with your actual API endpoint

    // Make a POST request to your server to add the order items to the database
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        orderType,
        items: orderItems, // Pass the order items directly
        orderNote,
      }),
    });

    // Check the response status and log accordingly
    if (response && response.status === 201) {
      console.log('Order items added to the database successfully');
    } else {
      console.error('Failed to add order items to the database');
    }

    return response;
  } catch (error) {
    console.error('Error in addCartToDatabase:', error);
    throw error;
  }
}