export const formatTime = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;

  if (hours > 0) {
    return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${
      minutes > 1 ? 's' : ''
    }`;
  }

  return `${minutes} min${minutes > 1 ? 's' : ''}`;
};
