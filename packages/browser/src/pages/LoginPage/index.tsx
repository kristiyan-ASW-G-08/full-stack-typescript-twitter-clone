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
import { observer } from 'mobx-react-lite';
import UserLoginValidator from '@twtr/common/source/schemaValidators/UserLoginValidator';
import Input from 'styled/Input';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import StyledForm from 'styled/Form';
import PageContainer from 'styled/PageContainer';
import Button from 'styled/Button';
import Logo from 'components/Logo';
import ValidationError from '@twtr/common/source/types/ValidationError';
import RootStoreContext from 'stores/RootStore/RootStore';
import Notification from 'types/Notification';

export const LoginPage: FC<RouteComponentProps> = ({ history }) => {
  const { authStore, notificationStore } = useContext(RootStoreContext);
  const submitHandler = async (
    e: FormikValues,
    { setFieldError }: FormikActions<FormikValues>,
  ): Promise<void> => {
    try {
      const response = await axios.post(
        'http://localhost:8090/users/user/tokens',
        e,
      );
      const { data } = response.data;
      const authState = { ...data, isAuth: true };
      const remainingMilliseconds = 60 * 60 * 1000;
      const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
      localStorage.setItem('expiryDate', expiryDate.toISOString());
      authStore.setAuthState(authState);
      const notification: Notification = {
        type: 'message',
        content: 'You have logged in successfully.',
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
      initialValues={{ email: '', password: '' }}
      onSubmit={submitHandler}
    >
      {() => (
        <PageContainer>
          <Form>
            <StyledForm>
              <Logo type="vertical" />
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
              <Button buttonType={'primary'} type="submit">
                Log In
              </Button>
            </StyledForm>
          </Form>
        </PageContainer>
      )}
    </Formik>
  );
};

export default withRouter(observer(LoginPage));
