import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useUpdateProfile = () => {
  const [error, setError] = useState(null);
  const [updateProfile, setUpdateProfile] = useState(null);
  const {user} = useAuthContext()

  const updateprofile = async () => {
    setError(null);

    const response = await fetch("user/signup", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const json = await response.json();
    console.log("JSON? ", json.firstName)

    if (!response.ok) {
      setError(json.error);
    } else {
      setUpdateProfile(json);
    }
  }

  return { updateprofile, error, updateProfile};
}