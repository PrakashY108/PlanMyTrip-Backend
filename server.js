import express from "express";
import apiRoutes from "./routes/apiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./configs/db.js";
import dotenv from 'dotenv';
dotenv.config();
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
app.use("/api/v1/user", authRoutes);
app.use("/api/v1/user", apiRoutes);

// Basic Error Handling Middleware (optional but recommended)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Something went wrong!" });
// });

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
