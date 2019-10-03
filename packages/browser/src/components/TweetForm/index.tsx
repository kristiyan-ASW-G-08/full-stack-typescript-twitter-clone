import React, { FC, useContext, useState, SyntheticEvent } from 'react';
import TweetValidator from 'validators/TweetValidator';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Input from 'styled/Input';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Button from 'styled/Button';
import ValidationError from '@twtr/common/source/types/ValidationError';
import RootStoreContext from 'stores/RootStore/RootStore';
import Avatar from 'components/Avatar/index';
import IconButton from 'styled/IconButton';
import Notification from 'types/Notification';
import useFilePicker from 'hooks/useFilePicker/useFilePicker';

import {
  TweetFormWrapper,
  TwButtonButtonContainer,
  ContentButtonsContainer,
  AvatarContainer,
  InputContainer,
} from './styled';

interface TweetFormProps extends RouteComponentProps {
  resetModalStore: () => void;
  token: string;
  setNotification: (notification: Notification) => void;
}
export const TweetForm: FC<TweetFormProps> = ({
  history,
  resetModalStore,
  token,
  setNotification,
}) => {
  const [type, setType] = useState<'text' | 'link' | 'retweet' | 'reply'>(
    'text',
  );
  const [hasImage, setHasImage] = useState<boolean>(false);
  const { fileData, fileHandler, resetFileData } = useFilePicker();
  const submitHandler = async (
    e: FormikValues,
    { setFieldError }: FormikActions<FormikValues>,
  ): Promise<void> => {
    try {
      const { linkUrl, text } = e;
      const formData = new FormData();
      if (fileData && fileData.file) {
        formData.set('image', fileData.file);
      }
      formData.set('linkUrl', linkUrl);
      formData.set('text', text);
      formData.set('type', type);
      const config = {
        headers: { Authorization: 'bearer ' + token },
      };
      const response = await axios.post(
        'http://localhost:8090/tweets',
        formData,
        config,
      );
      resetModalStore();
    } catch (error) {
      if (
        error &&
        error.response &&
        error.response.data &&
        Array.isArray(error.response.data)
      ) {
        const { data } = error.response.data;
        data.forEach((validationError: ValidationError) => {
          const { name, message } = validationError;
          setFieldError(name, message);
        });
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
      validationSchema={TweetValidator}
      initialValues={{ text: '', linkUrl: '' }}
      onSubmit={submitHandler}
    >
      {() => (
        <Form>
          <TweetFormWrapper>
            <AvatarContainer>
              <Avatar />
            </AvatarContainer>
            <InputContainer>
              <Input>
                <FastField
                  component={'textarea'}
                  name="text"
                  type="text"
                  placeholder="Text"
                />
                <ErrorMessage component="span" name="text" />
              </Input>
              {hasImage ? (
                <Input>
                  {fileData && fileData.fileUrl ? (
                    <img src={fileData.fileUrl} />
                  ) : (
                    ''
                  )}
                  <FastField
                    name="file"
                    type="file"
                    placeholder="Select an image"
                    onChange={(e: SyntheticEvent<HTMLInputElement>) =>
                      fileHandler(e)
                    }
                  />
                  <ErrorMessage component="span" name="file" />
                </Input>
              ) : (
                ''
              )}

              {type === 'link' ? (
                <Input>
                  <FastField name="linkUrl" type="text" placeholder="Link" />
                  <ErrorMessage component="span" name="linkUrl" />
                </Input>
              ) : (
                ''
              )}
            </InputContainer>

            <ContentButtonsContainer>
              <IconButton
                type="button"
                onClick={(e: SyntheticEvent) => {
                  setHasImage(!hasImage);
                  resetFileData();
                }}
              >
                <FontAwesomeIcon icon={'image'} />
              </IconButton>
              <IconButton
                type="button"
                onClick={(e: SyntheticEvent) => {
                  e.preventDefault();
                  type === 'link' ? setType('text') : setType('link');
                }}
              >
                <FontAwesomeIcon icon={'link'} />
              </IconButton>
            </ContentButtonsContainer>

            <TwButtonButtonContainer>
              <Button buttonType={'primary'} type="submit">
                Tweet
              </Button>
            </TwButtonButtonContainer>
          </TweetFormWrapper>
        </Form>
      )}
    </Formik>
  );
};

export default withRouter(observer(TweetForm));
