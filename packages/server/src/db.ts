import mongoose from "mongoose";

const mongoURI: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-zmcyw.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true`;
const db = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true });
  } catch (err) {}
};

export default db;
