import React, { useRef, SyntheticEvent } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useFilePicker from './useFilePicker';

window.URL.createObjectURL = jest.fn(() => 'mockString');

describe('usePortal', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('returns a file', () => {
    const fileMock = {
      name: 'test.jpg',
      type: 'image/jpg',
    } as File;

    const fileList: FileList = {
      length: 1,
      item: () => null,
      0: fileMock,
      [Symbol.iterator]: function*() {},
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
