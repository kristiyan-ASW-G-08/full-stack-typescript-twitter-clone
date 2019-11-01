/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React, { FC } from 'react';
import { Formik, Form, FormikValues, FormikActions } from 'formik';

import { useHistory, useLocation } from 'react-router-dom';
import FileValidator from 'validators/FIleValidator';
import StyledForm from 'styled/Form';
import Button from 'styled/Button';
import Logo from 'components/Logo';
import Notification from 'types/Notification';
import User from 'types/User';
import transformValidationErrors from 'utilities/transformValidationErrors';
import ImageInput from 'components/ImageInput';

interface UserCustomizationFormProps {
  token: string;
  setNotification: (notification: Notification) => void;
  updateUser: (user: User) => void;
  user?: User;
}
export const UserCustomizationForm: FC<UserCustomizationFormProps> = () => {
  const history = useHistory();
  const location = useLocation();
  const submitHandler = async (
    formValues: FormikValues,
    { setErrors }: FormikActions<FormikValues>,
  ): Promise<void> => {
    try {
      console.log(formValues);
      // const formData = populateFormData(formValues);
      // const request = await axios.patch(
      //   'http://localhost:8090/users/user/customization',
      //   formValues,
      //   {
      //     headers: { Authorization: `bearer ${token}` },
      //   },
      // );
      // const { user } = request.data.data;
      // updateUser(user);
      // const notification: Notification = {
      //   type: 'message',
      //   content:
      //     'You have signed up successfully.Confirm your email to log in.',
      // };
      // setNotification(notification);
      // history.goBack();
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
      validationSchema={FileValidator}
      initialValues={{}}
      onSubmit={submitHandler}
    >
      {({ setFieldValue }) => (
        <Form>
          <StyledForm>
            <Logo type="vertical" />
            <ImageInput name="avatar" setFieldValue={setFieldValue} />
            <ImageInput name="cover" setFieldValue={setFieldValue} />
            <Button buttonType="primary" type="submit">
              Save Changes
            </Button>
          </StyledForm>
        </Form>
      )}
    </Formik>
  );
};

export default UserCustomizationForm;
