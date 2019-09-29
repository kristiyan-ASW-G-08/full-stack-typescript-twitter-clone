import React, { FC, useContext } from 'react';
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

import {
  StyledTweetForm,
  TwButtonButtonContainer,
  ImgButtonContainer,
  AvatarContainer,
  InputContainer,
} from './StyledTweetForm';

export const TweetForm: FC<RouteComponentProps> = ({ history }) => {
  const { modalStore } = useContext(RootStoreContext);
  const submitHandler = async (
    e: FormikValues,
    { setFieldError }: FormikActions<FormikValues>,
  ): Promise<void> => {
    try {
      const response = await axios.post('http://localhost:8090/tweets', e);
      const { data } = response.data;
      console.log(data);
    } catch (error) {
      if (error.response) {
        const { data } = error.response.data;
        data.forEach((validationError: ValidationError) => {
          const { name, message } = validationError;
          setFieldError(name, message);
        });
      }
    }
  };
  return (
    <Formik
      validationSchema={TweetValidator}
      initialValues={{ text: '' }}
      onSubmit={submitHandler}
    >
      {() => (
        <Form>
          <StyledTweetForm>
            <AvatarContainer>
              <Avatar>
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K" />
              </Avatar>
            </AvatarContainer>

            <InputContainer>
              <Input>
                <FastField
                  component={() => <textarea />}
                  name="text"
                  type="text"
                  placeholder="Text"
                />
                <ErrorMessage component="span" name="text" />
              </Input>
            </InputContainer>
            <ImgButtonContainer>
              <IconButton>
                <FontAwesomeIcon icon={'image'} />
              </IconButton>
            </ImgButtonContainer>
            <TwButtonButtonContainer>
              <Button buttonType={'primary'} type="submit">
                Tweet
              </Button>
            </TwButtonButtonContainer>
          </StyledTweetForm>
        </Form>
      )}
    </Formik>
  );
};

export default withRouter(observer(TweetForm));
