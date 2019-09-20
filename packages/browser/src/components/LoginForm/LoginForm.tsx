import React, { FC } from 'react';
import {
  Formik,
  Form,
  FastField,
  ErrorMessage,
  FormikValues,
  FormikActions,
} from 'formik';
import axios from 'axios';
import UserSignUpValidator from '@twtr/common/source/schemaValidators/UserSignUpValidator';
import StyledInput from 'styled/StyledInput';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import StyledForm from 'styled/Form';
import CenterContainer from 'styled/CenterContainer';
import Button from 'styled/Button';
import Logo from 'components/Logo/Logo';
import ValidationError from '@twtr/common/source/types/ValidationError';

export const LoginForm: FC<RouteComponentProps> = () => {
  const submitHandler = async (
    e: FormikValues,
    { setFieldError }: FormikActions<FormikValues>,
  ): Promise<void> => {
    try {
      const response = await axios.post(
        'http://localhost:8090/users/user/tokens',
        e,
      );
    } catch (error) {
      if (error.response) {
        const { data } = error.response.data;
        data.forEach((validationError: ValidationError) => {
          const { name, message } = validationError;
          setFieldError(name, message);
        });
      }
    }
  };
  return (
    <Formik
      validationSchema={UserSignUpValidator}
      initialValues={{ email: '', password: '' }}
      onSubmit={e => {
        console.log(e);
      }}
    >
      {() => (
        <CenterContainer>
          <Form>
            <StyledForm>
              <Logo type="vertical" />
              <StyledInput>
                <FastField
                  name="email"
                  type="email"
                  placeholder="Email address"
                />
                <ErrorMessage component="span" name="email" />
              </StyledInput>
              <StyledInput>
                <FastField
                  name="password"
                  type="password"
                  placeholder="Password"
                />
                <ErrorMessage component="span" name="password" />
              </StyledInput>
              <Button buttonType={'primary'}>Log In</Button>
            </StyledForm>
          </Form>
        </CenterContainer>
      )}
    </Formik>
  );
};

export default withRouter(LoginForm);