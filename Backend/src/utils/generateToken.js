import jwt from "jsonwebtoken";

const GenerateToken = (tokenData) => {
  try {
    const token = jwt.sign(tokenData);
    return token;
  } catch (error) {
    console.log("error on generating token");
  }
};

export { GenerateToken };
