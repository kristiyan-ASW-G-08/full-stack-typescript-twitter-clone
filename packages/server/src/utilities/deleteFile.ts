import fs from 'fs';
import { RESTError, errors } from './RESTError';

const deleteFile = async (path: string | undefined): Promise<void> => {
  if (path !== undefined) {
    // @ts-ignore
    fs.access(path, fs.F_OK, (err: any): void => {
      if (err) {
        const { status, message } = errors.NotFound;
        throw new RESTError(status, message);
      }
    });
    fs.unlink(path, (err): void => {});
  }
};
export default deleteFile;
