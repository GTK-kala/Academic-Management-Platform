import jwt from "jsonwebtoken";

const GenerateToken = (user) => {
  try {
    const expiresIn = {
      expiresIn: "8h",
    };
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 8 * 60 * 60 * 1000,
      path: "/",
    };
    const tokenPayload = {
      userId: user.id,
      role: user.role,
      email: user.email,
    };
    const key = process.env.JWT_SECRET;
    const token = jwt.sign(tokenPayload, key, expiresIn);
    return { token, cookieOptions };
  } catch (error) {
    console.log("error on generating token");
  }
};

export { GenerateToken };
