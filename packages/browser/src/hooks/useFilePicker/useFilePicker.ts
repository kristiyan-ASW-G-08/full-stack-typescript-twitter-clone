import React, { useState, SyntheticEvent } from 'react';
interface FileData {
  fileUrl: string;
  file: File | undefined;
}
const useFilePicker = (): {
  fileData: FileData | undefined;
  fileHandler: (e: SyntheticEvent<HTMLInputElement>) => FileData;
} => {
  const [fileData, setFileData] = useState<FileData | undefined>();
  const fileHandler = (e: SyntheticEvent<HTMLInputElement>): FileData => {
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    const fileUrl = window.URL.createObjectURL(file);
    const fileData: FileData = {
      file,
      fileUrl,
    };
    setFileData(fileData);
    return fileData;
  };
  return { fileData, fileHandler };
};
export default useFilePicker;
