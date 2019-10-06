const setClipboard = async (text: string): Promise<void> => {
  await navigator.clipboard.writeText(text);
};
export default setClipboard;
