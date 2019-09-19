import React, { FC } from 'react';
import { FieldProps } from 'formik';
import StyledInput from './StyledInput';

const Input: FC<FieldProps> = ({ field, form }) => {
  const touched = form.touched[field.name];
  const error = form.errors[field.name];
  return (
    <StyledInput>
      <input type="text" {...field} />
      <span>{touched && error}</span>
    </StyledInput>
  );
};

export default Input;
