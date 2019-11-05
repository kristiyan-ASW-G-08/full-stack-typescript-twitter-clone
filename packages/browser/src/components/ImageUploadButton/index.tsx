/* eslint-disable jsx-a11y/label-has-for */
import React, { FC, SyntheticEvent, useState, useRef } from 'react';
import { ErrorMessage } from 'formik';
import { InputWrapper } from 'components/Input/styled';
import { UploadButton } from './styled';
import { getFile, clickHandler } from './handlers';

interface InputProps {
  name: string;
  setFieldValue: (...args: any) => any;
  buttonText?: string;
}
export const ImageUploadButton: FC<InputProps> = ({
  name,
  setFieldValue,
  buttonText,
}) => {
  const [fileUrl, setFileUrl] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadHandler = (e: SyntheticEvent<HTMLInputElement>) => {
    const { file, fileUrl } = getFile(e);
    setFileUrl(fileUrl);
    setFieldValue(name, file);
  };
  return (
    <InputWrapper>
      {fileUrl ? <img src={fileUrl} alt="" /> : ''}
      <input
        data-testid="input"
        ref={inputRef}
        name={name}
        type="file"
        onChange={uploadHandler}
        hidden
      />
      <UploadButton type="button" onClick={() => clickHandler(inputRef)}>
        {buttonText || 'Upload photo'}
      </UploadButton>
      <ErrorMessage component="label" name={name} />
    </InputWrapper>
  );
};

export default ImageUploadButton;
