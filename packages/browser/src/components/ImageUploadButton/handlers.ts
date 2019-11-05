import { RefObject, SyntheticEvent } from 'react';

export const getFile = (e: SyntheticEvent<HTMLInputElement>) => {
  const target = e.target as HTMLInputElement;
  const file: File = (target.files as FileList)[0];
  const fileUrl = window.URL.createObjectURL(file);
  return { file, fileUrl };
};
export const clickHandler = (inputRef: RefObject<HTMLInputElement>): void => {
  if (inputRef && inputRef.current) {
    inputRef.current.click();
  }
};
