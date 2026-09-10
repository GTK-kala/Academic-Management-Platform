const BASE_URL = import.meta.env.VITE_API_URL;

export const Get_Fee_Structure = async (userId, role) => {
  try {
    const response = await fetch(
      `${BASE_URL}/fees/structure?userId=${userId}&userRole=${role}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch fee structures");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching fee structures:", error);
    throw error;
  }
};

export const Add_Fee_Structure = async (feeData) => {
  try {
    const response = await fetch(`${BASE_URL}/fees/structure/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(feeData),
    });

    if (!response.ok) {
      throw new Error("Failed to add fee structure");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding fee structure:", error);
    throw error;
  }
};

export const Pay_Fee_Structure = async (paymentData) => {
  try {
    const response = await fetch(`${BASE_URL}/fees/structure/pay`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error("Failed to pay fee structure");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error paying fee structure:", error);
    throw error;
  }
};

export const Payed_Fee_Structure = async (userId, userRole) => {
  try {
    const res = await fetch(
      `${BASE_URL}/fees/structure/payed/${userId}?userRole=${userRole}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    if (!res.ok) {
      throw new Error("Failed to fetch fee structures");
    }
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching payed fee structure:", error);
    throw error;
  }
};
