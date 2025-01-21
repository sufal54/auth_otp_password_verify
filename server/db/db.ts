import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const Database = process.env.DATABASE;
  if (!Database) {
    throw new Error("Wrong Database URL");
  }
  try {
    if (await mongoose.connect(Database)) {
      console.log("Database connected");
    }
  } catch (e: unknown) {
    throw e;
  }
};

export default connectDB;
