import bcrypt from "bcryptjs";

const HashPassword = (passwordData) => {
  try {
    const hashPassword = bcrypt.hashSync(passwordData, 10);
    return hashPassword;
  } catch (error) {
    console.log("error on hashing password", error);
  }
};

const ComparePassword = (passwordData, hashPassword) => {
  try {
    bcrypt.compareSync(passwordData, hashPassword, (err, isMatch) => {
      if (err) {
        console.log("error on comparing password");
      } else if (!isMatch) {
        console.log("password did not match");
      } else {
        return true;
      }
    });
  } catch (error) {
    console.log("error on comparing password", error);
    return;
  }
};

export { HashPassword, ComparePassword };
