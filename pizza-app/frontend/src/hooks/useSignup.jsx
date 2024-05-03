import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, role) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("http://localhost:3001/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role })
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }

    if (response.ok) {
      // Saving the user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // update the User Context
      dispatch({ type: 'LOGIN', payload: json })
      setIsLoading(false)

      window.alert("Successful sign up")
    }
  }

  return { signup, isLoading, error };
}