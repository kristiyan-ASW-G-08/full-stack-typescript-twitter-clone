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
import Avatar from 'styled/Avatar';
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

export const TweetForm: FC<RouteComponentProps> = ({ history }) => {
  const { modalStore, authStore, notificationStore } = useContext(
    RootStoreContext,
  );
  const { token } = authStore.authState;
  const [type, setType] = useState<'text' | 'link' | 'retweet' | 'reply'>(
    'text',
  );
  const { file, fileHandler } = useFilePicker();
  const submitHandler = async (
    e: FormikValues,
    { setFieldError }: FormikActions<FormikValues>,
  ): Promise<void> => {
    try {
      const { file, linkUrl, text } = e;
      console.log(e);
      // let requestBody;
      // if (file) {
      //   requestBody = new FormData();
      //   requestBody.set('image', file);
      //   requestBody.set('linkUrl', linkUrl);
      //   requestBody.set('text', text);
      // } else {
      //   requestBody = {
      //     ...e,
      //     type,
      //   };
      // }
      // const config = {
      //   headers: { Authorization: 'bearer ' + token },
      // };
      // console.log(requestBody);
      // const response = await axios.post(
      //   'http://localhost:8090/tweets',
      //   requestBody,
      //   config,
      // );
      // const { data } = response.data;
    } catch (error) {
      if (error.response & error.response.data) {
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
        notificationStore.setNotification(notification);
      }
    }
  };
  return (
    <Formik
      validationSchema={TweetValidator}
      initialValues={{ text: '', linkUrl: '', file: '' }}
      onSubmit={submitHandler}
    >
      {() => (
        <Form>
          <TweetFormWrapper>
            <AvatarContainer>
              <Avatar>
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K" />
              </Avatar>
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
              <Input>
                <FastField
                  name="file"
                  type="file"
                  placeholder="Select an image"
                  onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                    const newFile = fileHandler(e);
                    console.log(newFile);
                  }}
                />
                <ErrorMessage component="span" name="text" />
              </Input>
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
              <IconButton>
                <FontAwesomeIcon icon={'image'} />
              </IconButton>
              <IconButton
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
