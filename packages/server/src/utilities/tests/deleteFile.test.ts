import mockFs from 'mock-fs';
import deleteFile from 'utilities/deleteFile';

describe('deleteFile', () => {
  afterEach(mockFs.restore);
  it('should delete a file', async () => {
    expect.assertions(1);
    mockFs({
      '/images': {
        'test.jpg': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
      },
    });
    const path = '/images/test.jpg';
    await expect(deleteFile(path)).resolves.toBeUndefined();
  });
});
