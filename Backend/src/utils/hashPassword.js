import bcrypt from "bcryptjs";

const HashPassword = (passwordData) => {
  try {
    const password = bcrypt.hashSync(passwordData, 10);
    return password;
  } catch (error) {
    console.log("error on hashing password", error);
  }
};

export { HashPassword };
