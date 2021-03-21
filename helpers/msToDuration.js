export const msToDuration = (ms) => {
  const days = Math.floor(ms / (1000 * 3600 * 24));
  ms -= days * 1000 * 3600 * 24;
  const time = new Date(ms).toISOString().substr(11, 8);
  return `${days ? days + ' days, ' : ''}${time}`;
};
