import { renderHook, act } from '@testing-library/react-hooks';
import useFilePicker from './useFilePicker';

window.URL.createObjectURL = jest.fn(() => 'mockString');
describe('useFilePicker', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('returns a file', () => {
    expect.assertions(1);
    const fileMock = {
      name: 'test.jpg',
      type: 'image/jpg',
    } as File;

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
    } as React.ChangeEvent<HTMLInputElement>;
    const { result } = renderHook(() => useFilePicker());
    act(() => {
      const { fileHandler } = result.current;
      const fileData = fileHandler(event);
      expect(fileData).toMatchSnapshot();
    });
  });
});
