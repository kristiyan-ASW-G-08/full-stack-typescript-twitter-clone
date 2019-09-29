import React, { FC, useContext } from 'react';
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
import Input from 'styled/Input';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import StyledForm from 'styled/Form';
import PageContainer from 'styled/PageContainer';
import Button from 'styled/Button';
import Logo from 'components/Logo/Logo';
import ValidationError from '@twtr/common/source/types/ValidationError';
import RootStoreContext from 'stores/RootStore/RootStore';
import Notification from 'types/Notification';

export const SignUpPage: FC<RouteComponentProps> = ({ history }) => {
  const { notificationStore } = useContext(RootStoreContext);
  const submitHandler = async (
    e: FormikValues,
    { setFieldError }: FormikActions<FormikValues>,
  ): Promise<void> => {
    try {
      const response = await axios.post('http://localhost:8090/users', e);
      const notification: Notification = {
        type: 'message',
        content:
          'You have signed up successfully.Confirm your email to log in.',
      };
      notificationStore.setNotification(notification);
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
              <Input>
                <FastField name="username" type="text" placeholder="Username" />
                <ErrorMessage component="span" name="username" />
              </Input>
              <Input>
                <FastField name="handle" type="text" placeholder="Handle" />
                <ErrorMessage component="span" name="handle" />
              </Input>
              <Input>
                <FastField
                  name="email"
                  type="email"
                  placeholder="Email address"
                />
                <ErrorMessage component="span" name="email" />
              </Input>
              <Input>
                <FastField
                  name="password"
                  type="password"
                  placeholder="Password"
                />
                <ErrorMessage component="span" name="password" />
              </Input>
              <Input>
                <FastField
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat Password"
                />
                <ErrorMessage component="span" name="confirmPassword" />
              </Input>
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
