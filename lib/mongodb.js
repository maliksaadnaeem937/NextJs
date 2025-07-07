import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const dbName = process.env.DbName;
    const mongoUri = process.env.MONGODB_URI;

    if (!dbName || !mongoUri) {
      throw new Error(
        "Database name or URI is not defined in environment variables."
      );
    }

    await mongoose.connect(mongoUri, {
      dbName: dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Connected to MongoDB database: ${dbName}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
