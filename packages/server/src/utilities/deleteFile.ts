import fs from 'fs';
import { RESTError, errors } from '@utilities/RESTError';
import getFilePath from '@utilities/getFilePath';

const deleteFile = async (fileUrl: string | undefined): Promise<void> => {
  if (fileUrl !== undefined) {
    // @ts-ignore
    fs.access(getFilePath(fileUrl), fs.F_OK, (err: any): void => {
      if (err) {
        const { status, message } = errors.NotFound;
        throw new RESTError(status, message);
      }
    });

    console.log(fileUrl, getFilePath(fileUrl));
    fs.unlink(getFilePath(fileUrl), (err): void => {});
  }
};
export default deleteFile;
