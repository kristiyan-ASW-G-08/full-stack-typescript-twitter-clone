import fs from 'fs';
import { CustomError, errors } from '@utilities/CustomError';
import getFilePath from '@utilities/getFilePath';

const deleteFile = async (fileUrl: string | undefined): Promise<void> => {
  try {
    if (fileUrl !== undefined) {
      await fs.promises.unlink(getFilePath(fileUrl));
    }
  } catch (err) {
    const { status, message } = errors.NotFound;
    const error = new CustomError(status, message);
    throw error;
  }
};
export default deleteFile;
