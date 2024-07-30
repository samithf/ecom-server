import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import apiRouter from "./routes/api";

dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes setup
app.use("/api", apiRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
