import React, { FC, useEffect, useState, SyntheticEvent } from 'react';
import TweetValidator from 'validators/TweetValidator';
import { Formik, Form, FormikValues, FormikActions } from 'formik';
import axios from 'axios';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Input from 'components/Input';
import Button from 'styled/Button';
import Avatar from 'components/Avatar/index';
import IconButton from 'styled/IconButton';
import ImageInput from 'components/ImageUploadButton';
import populateFormData from 'utilities/populateFormData';
import formErrorHandler from 'utilities/formErrorHandler';
import useStores from 'hooks/useStores';

import {
  TweetFormWrapper,
  TwButtonButtonContainer,
  ContentButtonsContainer,
  AvatarContainer,
  InputContainer,
} from './styled';

export const TweetForm: FC = () => {
  const { notificationStore, authStore } = useStores();
  const { token } = authStore.authState;
  //@ts-ignore
  const { replyId, retweetId } = useParams();
  const history = useHistory();
  const location = useLocation();
  const { tweet } = location.state;
  const [type, setType] = useState<'text' | 'link' | 'retweet' | 'reply'>(
    tweet?.type ? tweet.type : 'text',
  );
  const [hasImage, setHasImage] = useState<boolean>(false);
  useEffect(() => {
    if (replyId) {
      setType('reply');
    }
    if (retweetId) {
      setType('retweet');
    }
  }, [replyId, retweetId]);
  const submitHandler = async (
    formValues: FormikValues,
    { setErrors }: FormikActions<FormikValues>,
  ): Promise<void> => {
    console.log('handler');
    try {
      const { REACT_APP_API_URL } = process.env;
      const formData: FormData = populateFormData({
        ...formValues,
        type,
        retweetId,
        replyId,
      });
      console.log(token);
      const config = {
        headers: { Authorization: `bearer ${token}` },
      };
      console.log(tweet);
      if (tweet) {
        await axios.patch(
          `${REACT_APP_API_URL}/tweets/${tweet._id}`,
          formData,
          config,
        );
        history.push(`/tweet/${tweet._id}`);
      } else {
        const result = await axios.post(
          `${REACT_APP_API_URL}/tweets`,
          formData,
          config,
        );
        console.log(result);
        history.replace(`/tweet/${result.data.data.tweetId}`,{tweet:location});
        // history.goBack();
      }
    } catch (error) {
      formErrorHandler(error, setErrors, notification =>
        notificationStore.setNotification(notification),
      );
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
      {({ setFieldValue }) => (
        <Form>
         
          <TweetFormWrapper>
          
            <AvatarContainer>
              <Avatar />
            </AvatarContainer>
            <InputContainer>
            
              <Input
                component="textarea"
                name="text"
                type="text"
                placeholder="Text"
              />
              {hasImage ? (
                <ImageInput name="image" setFieldValue={setFieldValue} />
              ) : (
                ''
              )}

              {type === 'link' ? (
                <Input name="linkUrl" type="text" placeholder="Link" />
              ) : (
                ''
              )}
            </InputContainer>

            <ContentButtonsContainer>
              <IconButton
                type="button"
                onClick={() => {
                  setHasImage(!hasImage);
                  setFieldValue('image', undefined);
                }}
              >
                <FontAwesomeIcon icon="image" />
              </IconButton>
              <IconButton
                data-testid="link-button"
                type="button"
                onClick={(e: SyntheticEvent) => {
                  e.preventDefault();
                  setType(type === 'link' ? 'text' : 'link');
                }}
              >
                <FontAwesomeIcon icon="link" />
              </IconButton>
            </ContentButtonsContainer>

            <TwButtonButtonContainer>
              <Button buttonType="primary" type="submit">
                Tweet
              </Button>
            </TwButtonButtonContainer>
          </TweetFormWrapper>
        </Form>
      )}
    </Formik>
  );
};

export default TweetForm;
