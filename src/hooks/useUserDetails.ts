"use client";

import { getAuthUser } from "@/lib/auth";
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
    const storedUserDetails = getAuthUser();
    if (storedUserDetails) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserDetails(storedUserDetails);
    }
  }, []);

  return userDetails;
};

export default useUserDetails;
