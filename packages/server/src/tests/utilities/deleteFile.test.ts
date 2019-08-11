import mockFs from 'mock-fs';
import deleteFile from '@utilities/deleteFile';

describe('deleteFile', (): void => {
  afterEach((): void => {
    mockFs.restore();
  });

  it('should delete a file', async (): Promise<void> => {
    expect.assertions(1);
    mockFs({
      'assets/images': {
        'test.jpg': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
      },
    });
    const path = 'assets/images/test.jpg';
    await expect(deleteFile(path)).resolves.toBeUndefined();
  });
});
