import React, { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import axios from 'axios';
import PageContainer from 'styled/PageContainer';
import Button from 'styled/Button';
import { Title, Paragraph, Container } from 'styled/Title';

interface MatchParams {
  token: string;
}
export const EmailConfirmation: FC<RouteComponentProps<MatchParams>> = ({
  history,
  match,
}) => {
  const { token } = match.params;
  const confirmationHandler = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8090/users/user/${token}/confirm`,
      );

      history.replace('/');
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
  };

  return (
    <PageContainer>
      <Container>
        <Title>Email Confirmation</Title>
        <Paragraph>Confirm your email to use TwittClone</Paragraph>
        <div>
          <Button buttonType={'primary'} onClick={confirmationHandler}>
            Confirm Email
          </Button>
        </div>
      </Container>
    </PageContainer>
  );
};
export default withRouter(EmailConfirmation);
