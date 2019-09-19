import React, { FC } from 'react';
import { Formik, Form, Field } from 'formik';
import UserLoginValidator from '@twtr/common/source/schemaValidators/UserLoginValidator';
import Input from 'components/Input/Input';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import StyledForm from 'styled/Form';
import CenterContainer from 'styled/CenterContainer';
import Button from 'styled/Button';

export const LoginForm: FC<RouteComponentProps> = () => {
  return (
    <Formik
      validationSchema={UserLoginValidator}
      initialValues={{ email: '', password: '' }}
      onSubmit={() => {
        console.log('submit');
      }}
    >
      {() => (
        <CenterContainer>
          <Form>
            <StyledForm>
              <Field name="email" component={Input} />
              <Field name="password" component={Input} />
              <Button buttonType={'primary'}>Log In</Button>
            </StyledForm>
          </Form>
        </CenterContainer>
      )}
    </Formik>
  );
};

export default withRouter(LoginForm);
