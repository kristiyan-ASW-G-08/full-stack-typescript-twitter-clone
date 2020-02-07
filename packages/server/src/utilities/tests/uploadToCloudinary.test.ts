import cloudinary from 'cloudinary';
import uploadToCloudinary from '@utilities/uploadToCloudinary';

jest.mock('cloudinary');

// @ts-ignore
const cloudinaryMock = cloudinary as jest.Mock<typeof cloudinary>;

describe('uploadToCloudinary', () => {
  it('should call upload', async () => {
    expect.assertions(2);
    const path = './mockPath';
    const filename = 'fileName';
    // @ts-ignore
    uploadToCloudinary(path, filename);

    // @ts-ignore
    expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(path, {
      public_id: filename,
    });
  });
});
