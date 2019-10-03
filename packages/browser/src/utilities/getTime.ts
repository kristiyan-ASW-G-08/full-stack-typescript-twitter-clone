const getTime = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000);

  const minutes = Math.floor(milliseconds / (1000 * 60));

  const hours = Math.floor(milliseconds / (1000 * 60 * 60));

  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

  return { seconds, minutes, hours, days };
};

export default getTime;
