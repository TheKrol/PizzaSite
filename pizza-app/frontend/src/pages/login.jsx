import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './login.css'
import { useLogin } from "../hooks/useLogin"
import Sidebar from '../components/Sidebar';

function Login() {
  // Access the location state to get the message
  const location = useLocation();
  const [message, setMessage] = useState(location.state && location.state.message);

  // Use useEffect to remove the message after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(null);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Define the source location you want to check for (e.g., 'cartPage').
  const sourceLocation = location.state && location.state.sourceLocation;
  // Define the default redirect location if the source location is not 'cartPage'.
  let redirectLocation = '/'; // Change this to your default location.

  // If the source location is 'cartPage', set the redirect location to it.
  if (sourceLocation === 'orderCart') {
    redirectLocation = '/orderCart'; // Change this to your cart page route.
  }

  //used to redirect user to menu/dashboard
  const navigate = useNavigate();
  const { setUser } = useLogin();

  //Login use state functions, output the state of the user authentication
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  //Returns an error if user did not input email and/or pass correctly
  const { login, error, isLoading } = useLogin()

  //Used by the form to handle the submit if user entered email & pass.
  //Outputs the navigate function which in turn redirects user
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Attempt the login
      const loginSuccessful = await login(email, password);
      if (loginSuccessful) {
        navigate(redirectLocation);
      }
    } catch (error) {
      // Handle any errors that occur during the login process.
      console.error('Error during login:', error);
    }
  }

  return (
    <div className='login-page'>
      <Sidebar />
      <div className='container-login'>
        <div className='login-header'>Account Login</div>
        {message && <p className='Menu-error-message'>{message}</p>}
        <div className='form-login'>
          <div className='login-input-field'>
            <input
              placeholder='Email'
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className='login-input-field'>
            <input
              placeholder='Password'
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
        </div>
        {error && <div className='error'>{error}</div>}
        <div className='forgot-password-container'>
          <div className='forgot-password'>
            <span onClick={() => navigate("../forget-password")}>Forgot Password?</span>
          </div>
        </div>
        <div className='login-pg-buttons' onClick={handleSubmit}>
          <button disabled={isLoading}>Log in</button>
        </div>
        <div className='text-container'>Don't have an account? Sign up below!</div>
        <button className='signup-pg-buttons' onClick={() => navigate("../signup")}>Sign up</button>
      </div>
    </div>
  )
}

export default Login;