import jwt from "jsonwebtoken";



export const decodeToken = async (token) => {
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  console.log("wrgeg",decoded);
  return decoded?.user_id;
};
