const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// connect to MongoDB
connectDB();

// routes
app.use('/api/items', require("./routes/items"));
app.use('/api/payment', require("./routes/payment"));

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
