import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TestWrapper from 'testUtilities/TestWrapper';
import userEvent from '@testing-library/user-event';
import getFile from 'utilities/getFile';
import ImageInput from '.';
import clickHandler from './clickHandler';

jest.mock('./clickHandler');
jest.mock('utilities/getFile');

const getFileMock = getFile as jest.Mock<any>;
const clickHandlerMock = clickHandler as jest.Mock<any>;

const mockFile = new File(['file'], 'test.png', { type: 'image/png' });

getFileMock.mockReturnValue({ fileUrl: 'mockFileUrl', file: mockFile });
describe('ImageInput', () => {
  const name = 'image';
  const setFieldValue = jest.fn();
  const buttonText = 'Upload avatar';
  afterAll(() => jest.restoreAllMocks());
  it('render ImageInput', () => {
    expect.assertions(3);
    const { getByTestId, getByText } = render(
      <ImageInput
        name={name}
        setFieldValue={setFieldValue}
        buttonText={buttonText}
      />,
      {
        wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>,
      },
    );
    const uploadButton = getByText(buttonText);
    const imageInput = getByTestId('input');
    userEvent.click(uploadButton);

    expect(clickHandlerMock).toHaveBeenCalledTimes(1);

    fireEvent.change(imageInput, {
      target: {
        files: [mockFile],
      },
    });
    expect(getFileMock).toHaveBeenCalledTimes(1);
    expect(setFieldValue).toHaveBeenCalledWith('image', mockFile);
  });
});
