"use client";

const useUserDetails = (): {
  id: string;
  email: string;
  role: string;
} | null => {
  const storedUserDetails = localStorage.getItem("user_details");
  if (storedUserDetails) {
    try {
      return JSON.parse(storedUserDetails);
    } catch (error) {
      console.error("Failed to parse user details from localStorage:", error);
      return null;
    }
  }
  return null;
};

export default useUserDetails;
