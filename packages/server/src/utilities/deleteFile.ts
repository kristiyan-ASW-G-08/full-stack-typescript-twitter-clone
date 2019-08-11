import fs from 'fs';
import { CustomError, errors } from '@utilities/CustomError';

const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    const fsPromises = fs.promises;
    await fsPromises.unlink(fileUrl);
  } catch (err) {
    const { status, message } = errors.NotFound;
    const error = new CustomError(status, message);
    throw error;
  }
};
export default deleteFile;
