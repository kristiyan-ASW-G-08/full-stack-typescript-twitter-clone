import { FormikErrors, FormikValues } from 'formik';
import transformValidationErrors from 'utilities/transformValidationErrors';
import Notification from 'types/Notification';
import defaultWarning from 'utilities/defaultWarning';

const formErrorHandler = (
  error: any,
  setErrors: (errors: FormikErrors<FormikValues>) => void,
  setNotification: (notification: Notification) => void,
) => {
  console.log(error);
  if (error?.response?.data?.data && Array.isArray(error.response.data.data)) {
    console.log(error.response.data);
    setErrors(transformValidationErrors(error.response.data.data));
  } else {
    setNotification(defaultWarning);
  }
};

export default formErrorHandler;
