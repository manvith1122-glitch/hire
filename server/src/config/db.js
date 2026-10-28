import mongoose from 'mongoose';

let mongoMemoryServerInstance = null;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri && mongoUri.trim() !== '') {
    try {
      console.log('Connecting to configured MongoDB URI...');
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`✅ MongoDB Connected to: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.warn(`⚠️ Could not connect to configured MongoDB URI: ${error.message}`);
      console.log('Attempting fallback to embedded MongoDB Memory Server...');
    }
  }

  // Fallback to embedded in-memory MongoDB
  console.log('Initializing Zero-Config embedded MongoDB...');
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServerInstance = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServerInstance.getUri();

    const conn = await mongoose.connect(memoryUri);
    console.log(`✅ Embedded MongoDB Running at: ${memoryUri}`);
    return conn;
  } catch (memError) {
    console.warn(`⚠️ Embedded MongoDB could not be initialized: ${memError.message}`);
    console.warn(`👉 To connect a database, specify MONGO_URI in server/.env (e.g. mongodb://localhost:27017/referhire or MongoDB Atlas URI).`);
    return null;
  }
};

export const closeDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoMemoryServerInstance) {
      await mongoMemoryServerInstance.stop();
    }
  } catch (e) {
    // ignore
  }
};
