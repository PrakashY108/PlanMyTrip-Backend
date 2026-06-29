import jwt from "jsonwebtoken";
const JWT_SECRET = "SECRET_HAI_RE_BABA"; 

    export const generateToken = (value) => {
        try {
          
          const userToken = jwt.sign(value, process.env.JWT_SECRET, { expiresIn: "24h" });
      
          return userToken;
        } catch (error) {
          throw new Error("Error generating token");
        }
      }