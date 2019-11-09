import React, { FC } from 'react';
import { useHistory, Link } from 'react-router-dom';

import PageContainer from 'styled/PageContainer';
import Button from 'styled/Button';
import { Title, Subtitle, ButtonContainer } from './styled';

export const NotFound: FC = () => {
  const history = useHistory();
  return (
    <PageContainer>
      <Title>404</Title>
      <Subtitle>Page Not Found</Subtitle>
      <ButtonContainer>
        <Button buttonType="primary">
          <Link to="/">Home</Link>
        </Button>
        <Button buttonType="secondary" onClick={history.goBack}>
          Previous Page
        </Button>
      </ButtonContainer>
    </PageContainer>
  );
};
export default NotFound;
