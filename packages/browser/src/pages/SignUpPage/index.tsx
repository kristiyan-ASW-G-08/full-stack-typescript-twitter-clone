import React, { FC, useState } from 'react';
import { Formik, Form, FormikValues, FormikActions } from 'formik';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import UserSignUpValidator from '@twtr/common/source/schemaValidators/UserSignUpValidator';
import Input from 'components/Input';
import { FormWrapper, FieldsWrapper } from 'styled/Form';
import useStores from 'hooks/useStores';
import Logo from 'components/Logo';
import formErrorHandler from 'utilities/formErrorHandler';
import FormButton from 'components/FormButton';

export const SignUpPage: FC = () => {
  const history = useHistory();
  const { notificationStore } = useStores();
  const [loading, setLoading] = useState<boolean>(false);
  const submitHandler = async (
    formValues: FormikValues,
    { setErrors }: FormikActions<FormikValues>,
  ): Promise<void> => {
    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/users`, formValues);
      notificationStore.setNotification({
        type: 'message',
        content: 'You have signed up successfully.Now you can log in.',
      });
      history.replace('/');
    } catch (error) {
      setLoading(false);
      formErrorHandler(error, setErrors, notification =>
        notificationStore.setNotification(notification),
      );
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
            <FormButton loading={loading} text="Sign Up" />
          </FieldsWrapper>
        </Form>
      </FormWrapper>
    </Formik>
  );
};

export default SignUpPage;
