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
import UserLoginValidator from '@twtr/common/source/schemaValidators/UserLoginValidator';
import StyledInput from 'styled/StyledInput';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import StyledForm from 'styled/Form';
import PageContainer from 'styled/PageContainer';
import Button from 'styled/Button';
import Logo from 'components/Logo/Logo';
import ValidationError from '@twtr/common/source/types/ValidationError';

export const SignUpPage: FC<RouteComponentProps> = ({ history }) => {
  const submitHandler = async (
    e: FormikValues,
    { setFieldError }: FormikActions<FormikValues>,
  ): Promise<void> => {
    try {
      const response = await axios.post('http://localhost:8090/users', e);
      history.replace('/');
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
      validationSchema={UserLoginValidator}
      initialValues={{
        username: '',
        handle: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      onSubmit={submitHandler}
    >
      {() => (
        <PageContainer>
          <Form>
            <StyledForm>
              <Logo type="vertical" />
              <StyledInput>
                <FastField name="username" type="text" placeholder="Username" />
                <ErrorMessage component="span" name="username" />
              </StyledInput>
              <StyledInput>
                <FastField name="handle" type="text" placeholder="Handle" />
                <ErrorMessage component="span" name="handle" />
              </StyledInput>
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
              <StyledInput>
                <FastField
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat Password"
                />
                <ErrorMessage component="span" name="confirmPassword" />
              </StyledInput>
              <Button buttonType={'primary'} type="submit">
                Sign Up
              </Button>
            </StyledForm>
          </Form>
        </PageContainer>
      )}
    </Formik>
  );
};

export default withRouter(SignUpPage);
