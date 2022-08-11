import mongoose from 'mongoose';
import logger from './logger';

const connectToDB = async (mongoURI: string): Promise<void> => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    logger.error(`MongoDB Connection Error: ${err}`);
  }
};
export default connectToDB;
