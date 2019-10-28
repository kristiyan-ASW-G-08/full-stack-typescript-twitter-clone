import React, { FC, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import PageContainer from 'styled/PageContainer';
import Button from 'styled/Button';
import { Title, Paragraph, Container } from 'styled/Title';
import RootStoreContext from 'stores/RootStore/RootStore';
import Notification from 'types/Notification';

export const EmailConfirmation: FC = () => {
  const { notificationStore } = useContext(RootStoreContext);
  const { token } = useParams();
  const history = useHistory();
  const confirmationHandler = async () => {
    try {
      await axios.patch(`http://localhost:8090/users/user/${token}/confirm`);
      const notification: Notification = {
        type: 'message',
        content: 'You have confirmed you email successfully.',
      };
      notificationStore.setNotification(notification);
    } catch (error) {
      if (error.response) {
        const notification: Notification = {
          type: 'warning',
          content: 'There was an error.Try again later.',
        };
        notificationStore.setNotification(notification);
      }
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
