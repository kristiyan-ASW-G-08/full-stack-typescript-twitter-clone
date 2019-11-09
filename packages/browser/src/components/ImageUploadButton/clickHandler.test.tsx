import clickHandler from './clickHandler';

describe('clickHandler', () => {
  it('', () => {
    expect.assertions(1);
    const current = ({ click: jest.fn() } as unknown) as HTMLInputElement;
    const inputRef = {
      current,
    };
    clickHandler(inputRef);
    expect(inputRef.current.click).toHaveBeenCalledTimes(1);
  });
});
