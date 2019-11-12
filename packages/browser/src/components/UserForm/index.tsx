import React, { FC } from 'react';
import { Formik, Form, FormikValues, FormikActions } from 'formik';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import UserProfileValidator from '@twtr/common/source/schemaValidators/UserProfileValidator';
import ImageInput from 'components/ImageUploadButton';
import Input from 'components/Input';
import StyledForm from 'styled/Form';
import Button from 'styled/Button';
import Logo from 'components/Logo';
import Notification from 'types/Notification';
import User from 'types/User';
import transformValidationErrors from 'utilities/transformValidationErrors';
import populateFormData from 'utilities/populateFormData';
import getUrl from 'utilities/getUrl';

interface UserFormProps {
  token: string;
  setNotification: (notification: Notification) => void;
  updateUser: (user: User) => void;
  user: User;
}
export const UserForm: FC<UserFormProps> = ({
  setNotification,
  token,
  updateUser,
  user,
}) => {
  const history = useHistory();
  const { username, handle } = user;
  const submitHandler = async (
    formValues: FormikValues,
    { setErrors }: FormikActions<FormikValues>,
  ): Promise<void> => {
    try {
      const formData = populateFormData(formValues);

      const request = await axios.patch(
        getUrl('/users/user/profile'),
        formData,
        {
          headers: { Authorization: `bearer ${token}` },
        },
      );
      const { user } = request.data.data;
      updateUser(user);
      const notification: Notification = {
        type: 'message',
        content: 'Changes saved.',
      };
      setNotification(notification);
      history.goBack();
    } catch (error) {
      if (
        error &&
        error.response &&
        error.response.data &&
        Array.isArray(error.response.data)
      ) {
        const { data } = error.response.data;
        const errors = transformValidationErrors(data);
        setErrors(errors);
      } else {
        const notification: Notification = {
          type: 'warning',
          content: 'Something went wrong',
        };
        setNotification(notification);
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
      {({ setFieldValue }) => (
        <Form>
          <StyledForm>
            <Logo type="vertical" />

            <Input name="username" type="text" placeholder="Username" />

            <Input name="handle" type="text" placeholder="Handle" />

            <Input name="website" type="url" placeholder="Website" />
            <ImageInput
              name="avatar"
              setFieldValue={setFieldValue}
              buttonText="Upload avatar photo"
            />

            <ImageInput
              name="cover"
              setFieldValue={setFieldValue}
              buttonText="Upload cover photo"
            />
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
