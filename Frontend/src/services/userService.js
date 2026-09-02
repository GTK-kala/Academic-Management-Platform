const BASE_URL = import.meta.env.VITE_API_URL;

export const Get_User = async (userId, userRole) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}?userRole=${userRole}`);
    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }
    const userData = await res.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
