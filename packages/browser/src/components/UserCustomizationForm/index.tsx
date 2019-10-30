/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { FC, SyntheticEvent } from 'react';
import {
  Formik,
  Form,
  FastField,
  ErrorMessage,
  FormikValues,
  FormikActions,
} from 'formik';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import UserProfileValidator from '@twtr/common/source/schemaValidators/UserProfileValidator';
import { InputWrapper } from 'components/Input/styled';
import StyledForm from 'styled/Form';
import Button from 'styled/Button';
import Logo from 'components/Logo';
import Notification from 'types/Notification';
import User from 'types/User';
import transformValidationErrors from 'utilities/transformValidationErrors';
import useFilePicker from 'hooks/useFilePicker/useFilePicker';

interface UserCustomizationFormProps {
  token: string;
  setNotification: (notification: Notification) => void;
  updateUser: (user: User) => void;
  user: User;
}
export const UserCustomizationForm: FC<UserCustomizationFormProps> = ({
  setNotification,
  token,
  updateUser,
  user,
}) => {
  const history = useHistory();
  const { fileData, fileHandler } = useFilePicker();
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
      initialValues={{}}
      onSubmit={submitHandler}
    >
      <Form>
        <StyledForm>
          <Logo type="vertical" />

          {/* <InputWrapper>
            {fileData && fileData.fileUrl ? (
              <img src={fileData.fileUrl} alt="" />
            ) : (
              ''
            )}
            <label htmlFor="avatar">Avatar</label>
            <FastField
              name="avatar"
              type="file"
              placeholder="Select an image"
              onChange={(e: SyntheticEvent<HTMLInputElement>) => fileHandler(e)}
            />
            <ErrorMessage component="label" name="file" />
          </InputWrapper>

          <InputWrapper>
            {fileData && fileData.fileUrl ? (
              <img src={fileData.fileUrl} alt="" />
            ) : (
              ''
            )}
            <label htmlFor="cover">Cover</label>
            <FastField
              name="Cover"
              type="file"
              placeholder="Select an image"
              onChange={(e: SyntheticEvent<HTMLInputElement>) => fileHandler(e)}
            />
            <ErrorMessage component="label" name="file" />
          </InputWrapper> */}

          <Button buttonType="primary" type="submit">
            Save Changes
          </Button>
        </StyledForm>
      </Form>
    </Formik>
  );
};

export default UserCustomizationForm;
