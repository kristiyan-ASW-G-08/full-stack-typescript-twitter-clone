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
import transformValidationErrors from 'utilities/transformValidationErrors';
import populateFormData from 'utilities/populateFormData';
import getUrl from 'utilities/getUrl';
import useStores from 'hooks/useStores';

export const UserForm: FC = () => {
  const { authStore, notificationStore } = useStores();
  const history = useHistory();
  const { user, token } = authStore.authState;
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
      authStore.updateUser(user);
      const notification: Notification = {
        type: 'message',
        content: 'Changes saved.',
      };
      notificationStore.setNotification(notification);
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
        notificationStore.setNotification(notification);
      }
    }
  };
  return (
    <Formik
      validationSchema={UserProfileValidator}
      initialValues={{
        username: user && user.username ? user.username : '',
        handle: user && user.handle ? user.handle : '',
        website: user && user.website ? user.website : '',
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
