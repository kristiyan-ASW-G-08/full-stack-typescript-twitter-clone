import React, { FC } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import PageContainer from 'styled/PageContainer';
import Button from 'styled/Button';
import { Title, Paragraph, Container } from 'styled/Title';
import useStores from 'hooks/useStores';
import defaultWarning from 'utilities/defaultWarning';

export const EmailConfirmation: FC = () => {
  const { notificationStore } = useStores();
  const { token } = useParams();
  const history = useHistory();
  const confirmationHandler = async () => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/users/user/${token}/confirm`,
      );
      notificationStore.setNotification({
        type: 'message',
        content: 'You have confirmed you email successfully.',
      });
    } catch (error) {
      notificationStore.setNotification(defaultWarning);
    }
    history.replace('/');
  };

  return (
    <PageContainer>
      <Container>
        <Title>Email Confirmation</Title>
        <Paragraph>Confirm your email to use TwittClone</Paragraph>
        <div>
          <Button buttonType="primary" onClick={confirmationHandler}>
            Confirm Email
          </Button>
        </div>
      </Container>
    </PageContainer>
  );
};
export default EmailConfirmation;
