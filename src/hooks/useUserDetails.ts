"use client";

import { getAuthUser } from "@/lib/auth";
import { IUser } from "@/lib/types";
import { useEffect, useState } from "react";

const useUserDetails = (): IUser | null => {
  const [userDetails, setUserDetails] = useState<IUser | null>(null);

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
