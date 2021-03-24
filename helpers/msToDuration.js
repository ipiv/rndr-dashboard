export const msToDuration = (ms) => {
  if (!ms) return 'Invalid'
  const days = Math.floor(ms / (1000 * 3600 * 24));
  ms -= days * 1000 * 3600 * 24;
  try {
    const time = new Date(ms).toISOString().substr(11, 8);
    return `${days ? days + ' days, ' : ''}${time}`;
  } catch(err) {
    err.Message += '\nTried to convert: '+ms
    console.error('Tried to convert: ', ms)
    throw err
  }
};
