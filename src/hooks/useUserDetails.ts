"use client";

import { useEffect, useState } from "react";

const useUserDetails = (): {
  id: string;
  email: string;
  role: string;
} | null => {
  const [userDetails, setUserDetails] = useState<{
    id: string;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("auth_user");
    if (storedUserDetails) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUserDetails(JSON.parse(storedUserDetails));
      } catch (error) {
        console.error("Failed to parse user details from localStorage:", error);
        setUserDetails(null);
      }
    }
  }, []);

  return userDetails;
};

export default useUserDetails;
