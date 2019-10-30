import React, { FC } from 'react';
import { FastField, ErrorMessage } from 'formik';
import { InputWrapper } from './styled';

interface InputProps {
  name: string;
  placeholder: string;
  type: string;
  component?: 'input' | 'textarea';
}

export const Input: FC<InputProps> = ({
  name,
  placeholder,
  type,
  component = 'input',
}) => (
  <InputWrapper>
    <FastField
      name={name}
      type={type}
      placeholder={placeholder}
      component={component}
    />
    <ErrorMessage component="label" name={name} />
  </InputWrapper>
);

export default Input;
