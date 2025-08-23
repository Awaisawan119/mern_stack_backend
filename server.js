const express = require("express");
const cors = require("cors");
// Remove this line: require("dotenv").config(); // Not needed in production
const connectDB = require("./config/db");
const mongoose = require("mongoose");

// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Debug: Check if environment variables are loaded
console.log("Environment variables:");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI ? "*** loaded ***" : "NOT FOUND");
console.log("NODE_ENV:", process.env.NODE_ENV);

// connect to MongoDB
connectDB();

// routes
app.use('/api/items', require("./routes/items"));
app.use('/api/payment', require("./routes/payment"));

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  let status = 'unknown';
  
  switch(dbStatus) {
    case 0: status = 'disconnected'; break;
    case 1: status = 'connected'; break;
    case 2: status = 'connecting'; break;
    case 3: status = 'disconnecting'; break;
  }
  
  res.json({ 
    status: 'OK',
    database: status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Health check available at: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('📴 MongoDB connection closed gracefully');
  process.exit(0);
});