import * as yup from 'yup';

const formats = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'];

const FileValidator = yup.object().shape({
  avatar: yup
    .mixed()
    .required('A file is required')
    .test(
      'fileFormat',
      'Unsupported Format',
      value => value && formats.includes(value.type),
    ),
  cover: yup
    .mixed()
    .required('A file is required')
    .test(
      'fileFormat',
      'Unsupported Format',
      value => value && formats.includes(value.type),
    ),
});

export default FileValidator;
