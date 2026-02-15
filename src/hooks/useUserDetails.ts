"use client";

import { useAuth } from "@/context/AuthContext";
import { IUser } from "@/lib/types";

const useUserDetails = (): IUser | null => {
  const { user } = useAuth();
  return user;
};

export default useUserDetails;
