import React, { FC, useContext } from 'react';
import { Formik, Form, FormikValues, FormikActions } from 'formik';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import UserSignUpValidator from '@twtr/common/source/schemaValidators/UserSignUpValidator';
import Input from 'components/Input';
import { FormWrapper, FieldsWrapper } from 'styled/Form';

import Button from 'styled/Button';
import Logo from 'components/Logo';
import RootStoreContext from 'stores/RootStore';
import Notification from 'types/Notification';
import transformValidationErrors from 'utilities/transformValidationErrors';
import getUrl from 'utilities/getUrl';
import defaultWarning from 'utilities/defaultWarning';

export const SignUpPage: FC = () => {
  const history = useHistory();
  const { notificationStore } = useContext(RootStoreContext);
  const submitHandler = async (
    formValues: FormikValues,
    { setErrors }: FormikActions<FormikValues>,
  ): Promise<void> => {
    try {
      await axios.post(getUrl('/users'), formValues);
      const notification: Notification = {
        type: 'message',
        content:
          'You have signed up successfully.Confirm your email to log in.',
      };
      notificationStore.setNotification(notification);
      history.replace('/');
    } catch (error) {
      if (error.response && Array.isArray(error.response.data.data)) {
        const { data } = error.response.data;
        const errors = transformValidationErrors(data);
        setErrors(errors);
      } else {
        notificationStore.setNotification(defaultWarning);
      }
    }
  };
  return (
    <Formik
      validationSchema={UserSignUpValidator}
      initialValues={{
        username: '',
        handle: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      onSubmit={submitHandler}
    >
      <FormWrapper>
        <Form>
          <FieldsWrapper>
            <Logo type="vertical" />

            <Input name="username" type="text" placeholder="Username" />

            <Input name="handle" type="text" placeholder="Handle" />

            <Input name="email" type="email" placeholder="Email address" />

            <Input name="password" type="password" placeholder="Password" />

            <Input
              name="confirmPassword"
              type="password"
              placeholder="Repeat Password"
            />

            <Button buttonType="primary" type="submit">
              Sign Up
            </Button>
          </FieldsWrapper>
        </Form>
      </FormWrapper>
    </Formik>
  );
};

export default SignUpPage;
