import { useState } from 'react';

export const useProfile = () => {
  const [error, setError] = useState(null);

  const profile = async (email, firstName, lastName, phone, address, dob) => {
    setError(null);

    const response = await fetch("http://localhost:3001/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, firstName, lastName, phone, address, dob })
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    } else {
    }
  }

  return { profile, error };

}