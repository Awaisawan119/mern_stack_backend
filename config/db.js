const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        console.log("🔌 Attempting to connect to MongoDB...");
        
        // Check if the environment variable exists
        if (!process.env.MONGO_URI) {
            console.error("❌ MONGO_URI environment variable is missing");
            console.error("💡 Please add MONGO_URI to your Railway environment variables");
            process.exit(1);
        }
        
        // Log masked connection string for debugging (hides password)
        const maskedURI = process.env.MONGO_URI.replace(
            /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 
            'mongodb$1://$2:****@'
        );
        console.log('📋 Using connection string:', maskedURI);

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // 10 second timeout
        });
        
        console.log("✅ MongoDB Connected: ", conn.connection.host);
        console.log("📊 Database: ", conn.connection.name);
    }
    catch(err) {
        console.error("❌ MongoDB connection failed:");
        console.error("Error name:", err.name);
        console.error("Error code:", err.code || 'N/A');
        console.error("Error message:", err.message);
        
        // Specific error guidance
        if (err.code === 8000 || err.name === 'MongoServerError') {
            console.log('\n🔍 Authentication troubleshooting:');
            console.log('1. Check your username and password in MongoDB Atlas');
            console.log('2. Ensure special characters in password are URL-encoded');
            console.log('3. Verify the user has access to the specified database');
            console.log('4. Check network access in MongoDB Atlas (should allow 0.0.0.0/0)');
        }
        
        process.exit(1);
    }
}

// Add event listeners for better debugging
mongoose.connection.on('error', (err) => {
    console.log('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully');
});

module.exports = connectDB;