import cloudinary from 'cloudinary';
import deleteFromCloudinary from '@utilities/deleteFromCloudinary';


jest.mock('cloudinary');

// @ts-ignore
const cloudinaryMock = cloudinary as jest.Mock<typeof cloudinary>;

describe('deleteFromCloudinary', () => {
  it('should call upload', async () => {
    expect.assertions(2);
    const filename = 'fileName';
    // @ts-ignore
    deleteFromCloudinary(filename);

    // @ts-ignore
    expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(filename);
  });
});
