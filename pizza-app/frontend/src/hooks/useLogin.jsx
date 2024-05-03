import { useState } from 'react'
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:3001/user/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const json = await response.json();
  
      if (!response.ok) {
        setIsLoading(false);
        setError(json.error);
        return false; // Login failed
      }
  
      // Login successful
      // Save the user to local storage
      localStorage.setItem('user', JSON.stringify(json));
  
      // Update the auth context
      dispatch({ type: 'LOGIN', payload: json });
  
      // Update loading state
      setIsLoading(false);
  
      window.alert("Successful login");
      return true; // Login succeeded
    } catch (error) {
      // Handle network errors or other exceptions
      setIsLoading(false);
      setError(error.message);
      return false; // Login failed due to an error
    }

  }

  return { login, isLoading, error }
}