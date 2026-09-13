import jwt from "jsonwebtoken";

const GenerateToken = (tokenData, key, time) => {
  try {
    const token = jwt.sign(tokenData, key, time);
    return token;
  } catch (error) {
    console.log("error on generating token");
  }
};

export { GenerateToken };
