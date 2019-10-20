const populateFormData = (formValues: {
  [key: string]: string | undefined;
}): FormData => {
  return Object.entries(formValues).reduce((acc: FormData, [key, value]) => {
    if (value !== undefined) {
      acc.append(key, value);
    }
    return acc;
  }, new FormData());
};
export default populateFormData;
