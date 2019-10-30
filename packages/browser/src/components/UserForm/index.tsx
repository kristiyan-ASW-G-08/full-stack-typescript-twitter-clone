import React, { FC } from 'react';
import { Formik, Form, FormikValues, FormikActions } from 'formik';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import UserProfileValidator from '@twtr/common/source/schemaValidators/UserProfileValidator';
import Input from 'components/Input';
import StyledForm from 'styled/Form';
import Button from 'styled/Button';
import Logo from 'components/Logo';
import Notification from 'types/Notification';
import User from 'types/User';
import transformValidationErrors from 'utilities/transformValidationErrors';

interface UserFormProps {
  token: string;
  setNotification: (notification: Notification) => void;
  updateUser: (user: User) => void;
}
export const UserForm: FC<UserFormProps> = ({
  setNotification,
  token,
  updateUser,
}) => {
  const history = useHistory();
  const { user } = useLocation().state;
  const { username, handle } = user;
  const submitHandler = async (
    formValues: FormikValues,
    { setErrors }: FormikActions<FormikValues>,
  ): Promise<void> => {
    try {
      const request = await axios.patch(
        'http://localhost:8090/users/user/profile',
        formValues,
        {
          headers: { Authorization: `bearer ${token}` },
        },
      );
      const { user } = request.data.data;
      updateUser(user);
      const notification: Notification = {
        type: 'message',
        content:
          'You have signed up successfully.Confirm your email to log in.',
      };
      setNotification(notification);
      history.goBack();
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
      validationSchema={UserProfileValidator}
      initialValues={{
        username,
        handle,
        website: user.website ? user.website : '',
      }}
      onSubmit={submitHandler}
    >
      {() => (
        <Form>
          <StyledForm>
            <Logo type="vertical" />

            <Input name="username" type="text" placeholder="Username" />

            <Input name="handle" type="text" placeholder="Handle" />

            <Input name="website" type="url" placeholder="Website" />

            <Button buttonType="primary" type="submit">
              Save Changes
            </Button>
          </StyledForm>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
