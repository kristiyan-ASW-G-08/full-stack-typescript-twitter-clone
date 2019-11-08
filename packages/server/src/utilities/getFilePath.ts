const getFilePath = (fileURL: string): string => fileURL.split('/')[3] || '';
export default getFilePath;
