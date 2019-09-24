import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Container from 'styled/PageContainer';
import { StyledH1, StyledH2, StyledP, ButtonContainer } from './StyledNotFound';
import { Link } from 'react-router-dom';
import Button from 'styled/Button';
export const NotFound: FC<RouteComponentProps> = ({ history }) => {
  return (
    <Container>
      <StyledH1>404</StyledH1>
      <StyledH2>Page Not Found</StyledH2>
      <StyledP>
        The page you were looking for was moved, removed or never existed
      </StyledP>
      <ButtonContainer>
        <Button buttonType={'primary'}>
          <Link to="/">Go Home</Link>
        </Button>
        <Button buttonType={'secondary'} onClick={history.goBack}>
          Previous Page
        </Button>
      </ButtonContainer>
    </Container>
  );
};
export default NotFound;
