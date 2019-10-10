import React, { FC, useEffect, useState, SyntheticEvent } from 'react';
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
import Avatar from 'components/Avatar/index';
import IconButton from 'styled/IconButton';
import Notification from 'types/Notification';
import useFilePicker from 'hooks/useFilePicker/useFilePicker';
import ModalPayload from 'types/ModalPayload';
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
  payload: ModalPayload;
}
export const TweetForm: FC<TweetFormProps> = ({
  history,
  resetModalStore,
  token,
  setNotification,
  payload,
}) => {
  const [type, setType] = useState<'text' | 'link' | 'retweet' | 'reply'>(
    'text',
  );
  useEffect(() => {
    if (payload.type) {
      setType(payload.type);
    }
  }, []);
  const [hasImage, setHasImage] = useState<boolean>(false);
  const { fileData, fileHandler, resetFileData } = useFilePicker();
  const submitHandler = async (
    e: FormikValues,
    { setFieldError }: FormikActions<FormikValues>,
  ): Promise<void> => {
    try {
      const { retweetedId, replyId } = payload;
      const data = {
        ...e,
        type,
        retweetedId,
        replyId,
      };
      let formData: FormData = new FormData();
      if (fileData && fileData.file) {
        formData = Object.entries(data).reduce(
          (acc: FormData, [key, value]) => {
            console.log(key, value);
            if (key !== undefined && value !== undefined) {
              acc.append(key, value);
            }

            return acc;
          },
          new FormData(),
        );
        formData.append('image', fileData.file);
      }
      const config = {
        headers: { Authorization: 'bearer ' + token },
      };
      const responseBody = fileData && fileData.file ? formData : data;
      const response = await axios.post(
        'http://localhost:8090/tweets',
        responseBody,
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
        console.log(error);
        // setNotification(notification);
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
