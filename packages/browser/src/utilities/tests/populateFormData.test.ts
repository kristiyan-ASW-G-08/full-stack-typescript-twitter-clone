import populateFormData from 'utilities/populateFormData';

describe('populateFormData', () => {
  it('removes all keys with value of undefined', () => {
    const formValues = {
      username: 'newUsername',
      handle: 'newHandle',
      undef: undefined,
    };
    const formData = populateFormData(formValues);
    expect(formData.has('username')).toBeTruthy();
    expect(formData.has('handle')).toBeTruthy();
    expect(formData.has('undef')).toBeFalsy();
  });
});
