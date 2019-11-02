import { ChangeEvent } from 'react';
import getFile from 'utilities/getFile';

declare global {
  interface URL {
    createObjectUrl: (file: File) => string;
  }
}
describe('getFile', () => {
  it('should return a file and a file url', () => {
    expect.assertions(2);

    global.URL.createObjectURL = jest.fn(() => 'fileUrl');

    const fileMock = new File(['file'], 'test.png', { type: 'image/png' });
    const fileList: FileList = {
      length: 1,
      item: () => null,
      0: fileMock,
      // eslint-disable-next-line no-empty-function
      *[Symbol.iterator]() {},
    };
    const event = {
      target: {
        files: fileList,
      },
    } as ChangeEvent<HTMLInputElement>;
    const { file, fileUrl } = getFile(event);
    expect(file).toEqual(fileMock);
    expect(fileUrl).toMatch('fileUrl');
  });
});
