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
import { useHistory } from 'react-router-dom';
import UserLoginValidator from '@twtr/common/source/schemaValidators/UserLoginValidator';
import Input from 'styled/Input';
import StyledForm from 'styled/Form';
import PageContainer from 'styled/PageContainer';
import Button from 'styled/Button';
import Logo from 'components/Logo';
import RootStoreContext from 'stores/RootStore/RootStore';
import Notification from 'types/Notification';
import transformValidationErrors from 'utilities/transformValidationErrors';

export const SignUpPage: FC = () => {
  const history = useHistory();
  const { notificationStore } = useContext(RootStoreContext);
  const submitHandler = async (
    e: FormikValues,
    { setErrors }: FormikActions<FormikValues>,
  ): Promise<void> => {
    try {
      await axios.post('http://localhost:8090/users', e);
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
        const errors = transformValidationErrors(data);
        setErrors(errors);
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

export default SignUpPage;
