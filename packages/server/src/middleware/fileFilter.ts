import { Request } from 'express';

const fileFilter = (
  req: Request,
  file: any,
  cb: (...args: any) => any,
): void => {
  const formats = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'];
  cb(null, formats.includes(file.mimetype));
};

export default fileFilter;
