import React, { FC, useContext } from 'react';
import axios from 'axios';
import { Formik, Form, FormikValues, FormikActions } from 'formik';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import UserLoginValidator from '@twtr/common/source/schemaValidators/UserLoginValidator';
import { FormWrapper, FieldsWrapper } from 'styled/Form';
import Button from 'styled/Button';
import Logo from 'components/Logo';
import RootStoreContext from 'stores/RootStore/RootStore';
import Notification from 'types/Notification';
import transformValidationErrors from 'utilities/transformValidationErrors';
import Input from 'components/Input';

export const LoginPage: FC = () => {
  const { authStore, notificationStore } = useContext(RootStoreContext);
  const history = useHistory();
  const submitHandler = async (
    formValues: FormikValues,
    { setErrors }: FormikActions<FormikValues>,
  ): Promise<void> => {
    try {
      const response = await axios.post(
        'http://localhost:8090/users/user/tokens',
        formValues,
      );
      const { data } = response.data;
      const remainingMilliseconds = 60 * 60 * 1000;
      const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
      localStorage.setItem('expiryDate', expiryDate.toISOString());
      authStore.setAuthState(data);
      const notification: Notification = {
        type: 'message',
        content: 'You have logged in successfully.',
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
      initialValues={{ email: '', password: '' }}
      onSubmit={submitHandler}
    >
      <FormWrapper>
        <Form>
          <FieldsWrapper>
            <Logo type="vertical" />

            <Input name="email" type="email" placeholder="Email address" />

            <Input name="password" type="password" placeholder="Password" />

            <Button buttonType="primary" type="submit">
              Log In
            </Button>
          </FieldsWrapper>
        </Form>
      </FormWrapper>
    </Formik>
  );
};

export default observer(LoginPage);
