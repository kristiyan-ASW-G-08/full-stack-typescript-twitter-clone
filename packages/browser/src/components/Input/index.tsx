import React, { FC } from 'react';
import { FastField, ErrorMessage } from 'formik';
import { InputWrapper } from './styled';

interface InputProps {
  name: string;
  placeholder: string;
  type: string;
}

export const Input: FC<InputProps> = ({ name, placeholder, type }) => (
  <InputWrapper>
    <FastField name={name} type={type} placeholder={placeholder} />
    <ErrorMessage component="label" name={name} />
  </InputWrapper>
);

export default Input;
