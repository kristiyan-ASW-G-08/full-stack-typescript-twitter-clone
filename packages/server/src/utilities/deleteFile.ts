import fs from 'fs';
import { CustomError, errors } from '@utilities/CustomError';

const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    await fs.promises.unlink(fileUrl);
  } catch (err) {
    const { status, message } = errors.NotFound;
    const error = new CustomError(status, message);
    throw error;
  }
};
export default deleteFile;
