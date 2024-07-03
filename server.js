const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const cors = require("cors");
dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

app.use("/auth", authRoutes);

module.exports = app;
