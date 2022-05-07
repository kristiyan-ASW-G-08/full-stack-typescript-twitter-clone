import React, { FC } from 'react';
import { Button } from 'styled/Button';
import FormLoader from './styled';

interface FormButtonProps {
  text: string;
  loading: boolean;
}
const FormButton: FC<FormButtonProps> = ({ text, loading }) => (
  <Button type="submit" buttonType="primary">
    {loading ? <FormLoader className="loader" /> : text}
  </Button>
);

export default FormButton;
