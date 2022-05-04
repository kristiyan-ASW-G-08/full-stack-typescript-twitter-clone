import cloudinary from 'cloudinary';
import uploadToCloudinary from '@utilities/uploadToCloudinary';

jest.mock('cloudinary');

jest.spyOn(cloudinary.v2.uploader, 'upload');

describe('uploadToCloudinary', () => {
  it('should call upload', async () => {
    expect.assertions(2);
    const path = './mockPath';
    const filename = 'fileName';
    // @ts-ignore
    uploadToCloudinary(path, filename);

    // @ts-ignore
    expect(cloudinary.v2.uploader.upload).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(cloudinary.v2.uploader.upload).toHaveBeenCalledWith(path, {
      folder: 'twittclone',
      public_id: filename,
    });
  });
});
