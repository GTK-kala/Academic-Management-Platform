const BASE_URL = import.meta.env.VITE_API_URL;

export const Get_User = async (userId, userRole) => {
  try {
    const res = await fetch(
      `${BASE_URL}/users/profile/${userId}?userRole=${userRole}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
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

export const Update_Profile = async (userId, userRole, updatedData) => {
  try {
    const res = await fetch(
      `${BASE_URL}/users/profile/${userId}?userRole=${userRole}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      },
    );
    if (!res.ok) {
      throw new Error("Failed to update user data");
    }
    const userData = await res.json();
    return userData;
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

export const Update_Password = async (userId, userRole, passwordData) => {
  try {
    const res = await fetch(
      `${BASE_URL}/users/password/${userId}?userRole=${userRole}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(passwordData),
      },
    );
    if (!res.ok) {
      throw new Error("Failed to update password");
    }
    const userData = await res.json();
    return userData;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};
