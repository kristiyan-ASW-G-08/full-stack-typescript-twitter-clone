import fs from 'fs';
import { RESTError, errors } from '@utilities/RESTError';
import getFilePath from '@utilities/getFilePath';

const deleteFile = async (fileUrl: string | undefined): Promise<void> => {
  try {
    if (fileUrl !== undefined) {
      await fs.promises.unlink(getFilePath(fileUrl));
    }
  } catch (err) {
    const { status, message } = errors.NotFound;
    const error = new RESTError(status, message);
    throw error;
  }
};
export default deleteFile;
