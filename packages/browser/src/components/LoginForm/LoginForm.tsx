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
import StyledInput from 'styled/StyledInput';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import StyledForm from 'styled/Form';
import PageContainer from 'styled/PageContainer';
import Button from 'styled/Button';
import Logo from 'components/Logo/Logo';
import ValidationError from '@twtr/common/source/types/ValidationError';
import RootStoreContext from 'stores/RootStore/RootStore';

export const LoginForm: FC<RouteComponentProps> = () => {
  const { authStore } = useContext(RootStoreContext);
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
      authStore.setAuthState(authState);
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

export default withRouter(observer(LoginForm));
