import React from 'react';
import { storiesOf } from '@storybook/react';
import Input from 'components/Input';
import { Formik, Form } from 'formik';

storiesOf('Input', module)
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
          <Form style={{ width: '300px', textAlign: 'center' }}>
            <Input name="username" type="text" placeholder="Username" />
          </Form>
        )}
      </Formik>
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'light' },
    },
  )
  .add(
    'light theme: textarea',
    () => (
      <Formik
        onSubmit={() => {}}
        initialValues={{
          username: '',
        }}
      >
        {() => (
          <Form style={{ width: '300px', textAlign: 'center' }}>
            <Input
              name="username"
              type="text"
              placeholder="Username"
              component="textarea"
            />
          </Form>
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
          <Form style={{ width: '300px', textAlign: 'center' }}>
            <Input name="username" type="text" placeholder="Username" />
          </Form>
        )}
      </Formik>
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  )
  .add(
    'dark theme: textarea',
    () => (
      <Formik
        onSubmit={() => {}}
        initialValues={{
          username: '',
        }}
      >
        {() => (
          <Form style={{ width: '300px', textAlign: 'center' }}>
            <Input
              name="username"
              type="text"
              placeholder="Username"
              component="textarea"
            />
          </Form>
        )}
      </Formik>
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  );
