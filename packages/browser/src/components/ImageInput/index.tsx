/* eslint-disable jsx-a11y/label-has-for */
import React, { FC, SyntheticEvent, useState } from 'react';
import { ErrorMessage } from 'formik';
import { InputWrapper } from 'components/Input/styled';

interface InputProps {
  name: string;
  setFieldValue: (...args: any) => any;
}

const getFile = (e: SyntheticEvent<HTMLInputElement>) => {
  const target = e.target as HTMLInputElement;
  const file: File = (target.files as FileList)[0];
  const fileUrl = window.URL.createObjectURL(file);
  return { file, fileUrl };
};
export const ImageInput: FC<InputProps> = ({ name, setFieldValue }) => {
  const [fileUrl, setFileUrl] = useState<string>();
  return (
    <InputWrapper>
      {fileUrl ? <img src={fileUrl} alt="" /> : ''}
      <input
        name={name}
        type="file"
        onChange={(e: SyntheticEvent<HTMLInputElement>) => {
          const { file, fileUrl } = getFile(e);
          setFileUrl(fileUrl);
          setFieldValue(name, file);
        }}
      />
      <ErrorMessage component="label" name={name} />
    </InputWrapper>
  );
};

export default ImageInput;
