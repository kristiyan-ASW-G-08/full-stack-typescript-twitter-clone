import React, { FC, useContext } from 'react';
import axios from 'axios';
import { Formik, Form, FormikValues, FormikActions } from 'formik';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import UserLoginValidator from '@twtr/common/source/schemaValidators/UserLoginValidator';
import { FormWrapper, FieldsWrapper } from 'styled/Form';
import Logo from 'components/Logo';
import RootStoreContext from 'stores/RootStore';
import formErrorHandler from 'utilities/formErrorHandler';
import Input from 'components/Input';
import FormButton from 'components/FormButton';

export const LoginPage: FC = () => {
  const { authStore, notificationStore } = useContext(RootStoreContext);
  const history = useHistory();
  const submitHandler = async (
    formValues: FormikValues,
    { setErrors }: FormikActions<FormikValues>,
  ): Promise<void> => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/user/tokens`,
        formValues,
      );
      const { data } = response.data;
      const remainingMilliseconds = 60 * 60 * 1000;
      const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
      localStorage.setItem('expiryDate', expiryDate.toISOString());
      authStore.setAuthState(data);
      notificationStore.setNotification({
        type: 'message',
        content: 'You have logged in successfully.',
      });
      history.replace('/');
    } catch (error) {
      formErrorHandler(error, setErrors, notification =>
        notificationStore.setNotification(notification),
      );
    }
  };
  return (
    <Formik
      validationSchema={UserLoginValidator}
      initialValues={{ email: '', password: '' }}
      onSubmit={submitHandler}
    >
      {({ isSubmitting }) => (
        <FormWrapper>
          <Form>
            <FieldsWrapper>
              <Logo type="vertical" />

              <Input name="email" type="email" placeholder="Email address" />

              <Input name="password" type="password" placeholder="Password" />

              <FormButton loading={isSubmitting} text="Login" />
            </FieldsWrapper>
          </Form>
        </FormWrapper>
      )}
    </Formik>
  );
};

export default observer(LoginPage);
