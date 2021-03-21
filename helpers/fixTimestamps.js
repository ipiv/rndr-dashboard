import { parseDate } from "./parseDate";

export const fixTimestamps = (data) => {
  let offsetUntil = 0;
  const logLines = data.split(/\r?\n/);
  for (let i = 0; i < logLines.length; i++) {
    const line = logLines[i];
    if (logLines.length - 1 == i) {
      break;
    }
    if (line.includes('rndr client is starting')) {
      // offsetUntil = 0
      continue;
    }
    let timestamp = parseDate(logLines[i].substr(0, 19));
    if (offsetUntil) {
      if (new Date(timestamp).getDate() == offsetUntil) {
        timestamp += 3600 * 1000 * 12;
      } else {
        offsetUntil = 0;
      }
    } else if (timestamp > parseDate(logLines[i + 1].substr(0, 19))) {
      offsetUntil = new Date(timestamp).getDate();
    }
    logLines[i] = line.replace(
      line.substr(0, 19),
      new Date(timestamp).toISOString()
    );
  }
  return logLines;
};
