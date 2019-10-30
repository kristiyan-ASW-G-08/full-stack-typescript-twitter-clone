import { useState, SyntheticEvent } from 'react';

interface FileData {
  [key: string]: {
    fileUrl: string;
    file: File | undefined;
  };
}
const useFilePicker = (): {
  fileData: FileData;
  fileHandler: (e: SyntheticEvent<HTMLInputElement>, key: string) => FileData;
  resetFileData: () => void;
} => {
  const [fileData, setFileData] = useState<FileData>({});
  const fileHandler = (
    e: SyntheticEvent<HTMLInputElement>,
    key: string,
  ): FileData => {
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    const fileUrl = window.URL.createObjectURL(file);
    const newFileData: FileData = {
      ...fileData,
      [key]: {
        file,
        fileUrl,
      },
    };
    setFileData(newFileData);
    return newFileData;
  };
  const resetFileData = (): void => {
    setFileData({});
  };
  return { fileData, fileHandler, resetFileData };
};
export default useFilePicker;
