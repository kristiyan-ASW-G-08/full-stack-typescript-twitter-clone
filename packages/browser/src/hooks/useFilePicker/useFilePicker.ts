import React, { useState, SyntheticEvent } from 'react';

const useFilePicker = (): {
  file: File | undefined;
  fileHandler: (e: SyntheticEvent<HTMLInputElement>) => void;
} => {
  const [file, setFile] = useState<File | undefined>();
  const fileHandler = (e: SyntheticEvent<HTMLInputElement>) => {
    console.log(e);
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    console.log(file);
    setFile(file);
  };
  return { file, fileHandler };
};
export default useFilePicker;
