import React from 'react';
import { storiesOf } from '@storybook/react';
import { Formik, Form } from 'formik';
import { FormWrapper, FieldsWrapper } from 'styled/Form';
import Input from 'components/Input';
import { Button } from 'styled/Button';
import Logo from 'components/Logo';
import ImageUploadButton from 'components/ImageUploadButton';

storiesOf('Form', module)
  .add(
    'light theme',
    () => (
      <Formik
        onSubmit={() => {}}
        initialValues={{
          username: '',
        }}
      >
        {() => (
          <FormWrapper>
            <Form>
              <FieldsWrapper>
                <Logo type="vertical" />

                <Input name="email" type="email" placeholder="Email address" />

                <Input name="password" type="password" placeholder="Password" />

                <Input
                  name="bio"
                  type="text"
                  placeholder="Bio"
                  component="textarea"
                />

                <ImageUploadButton name="avatar" setFieldValue={() => {}} />

                <Button buttonType="primary" type="submit">
                  Submit
                </Button>
              </FieldsWrapper>
            </Form>
          </FormWrapper>
        )}
      </Formik>
    ),

    {
      info: { inline: true },
      options: { currentTheme: 'light' },
    },
  )
  .add(
    'dark theme',
    () => (
      <Formik
        onSubmit={() => {}}
        initialValues={{
          username: '',
        }}
      >
        {() => (
          <FormWrapper>
            <Form>
              <FieldsWrapper>
                <Logo type="vertical" />

                <Input name="email" type="email" placeholder="Email address" />

                <Input name="password" type="password" placeholder="Password" />

                <Input
                  name="bio"
                  type="text"
                  placeholder="Bio"
                  component="textarea"
                />

                <ImageUploadButton name="avatar" setFieldValue={() => {}} />

                <Button buttonType="primary" type="submit">
                  Submit
                </Button>
              </FieldsWrapper>
            </Form>
          </FormWrapper>
        )}
      </Formik>
    ),

    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  );
