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
import TweetFormModalProps from 'types/TweetFormProps';
import {
  TweetFormWrapper,
  TwButtonButtonContainer,
  ContentButtonsContainer,
  AvatarContainer,
  InputContainer,
} from './styled';
import populateFormData from 'utilities/populateFormData';

interface TweetFormProps extends RouteComponentProps {
  resetModalState: () => void;
  token: string;
  setNotification: (notification: Notification) => void;
  tweetFormProps: TweetFormModalProps;
}

export const TweetForm: FC<TweetFormProps> = ({
  resetModalState,
  token,
  setNotification,
  tweetFormProps,
}) => {
  const [type, setType] = useState<'text' | 'link' | 'retweet' | 'reply'>(
    'text',
  );
  const [hasImage, setHasImage] = useState<boolean>(false);
  const { fileData, fileHandler, resetFileData } = useFilePicker();
  const { tweet } = tweetFormProps;
  useEffect(() => {
    setType(tweetFormProps.type || 'text');
  }, []);
  const submitHandler = async (
    e: FormikValues,
    { setFieldError }: FormikActions<FormikValues>,
  ): Promise<void> => {
    try {
      const { retweetedId, replyId } = tweetFormProps;
      const formData: FormData = populateFormData({
        ...e,
        type,
        retweetedId,
        replyId,
      });
      if (fileData && fileData.file) {
        formData.append('image', fileData.file);
      }
      const config = {
        headers: { Authorization: 'bearer ' + token },
      };
      if (tweet) {
        await axios.patch(
          `http://localhost:8090/tweets/${tweet._id}`,
          formData,
          config,
        );
      } else {
        await axios.post('http://localhost:8090/tweets', formData, config);
      }
      resetModalState();
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
      initialValues={{
        text: tweet ? tweet.text : '',
        linkUrl: tweet ? tweet.link : '',
      }}
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
                data-testid="link-button"
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
