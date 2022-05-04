import { Request } from 'express';

const fileFilter = (_: Request, file: any, cb: (...args: any) => any): void => {
  const formats = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/svg+xml',
    'image/webp',
  ];
  cb(null, formats.includes(file.mimetype));
};

export default fileFilter;
