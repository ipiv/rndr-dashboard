import { fixTimestamps } from "./fixTimestamps";

export const parseLog = (data) => {
  const logLines = fixTimestamps(data);
  const sessions = [];
  let ob_score = 0;
  for (let i = 0; i < logLines.length; i++) {
    const line = logLines[i];

    if (line.includes('rndr client is starting')) {
      // new sess
      if (sessions.length) {
        // mark end of previous sess
        sessions[sessions.length - 1]['end'] = logLines[i - 2].substr(
          0,
          24
        );
      }
      // initialize new sess info and mark start date
      sessions.push({
        id: sessions.length,
        start: logLines[i + 1].substr(0, 24),
        end: false,
        ob_score: ob_score,
        renders: [],
      });
    } else if (line.includes('node scored')) {
      // OB score updated
      ob_score = line.match(/(\d)+\.(\d+)$/g)[0];
    } else if (line.includes('setting renderer state to 3')) {
      // render started
      if (logLines.length - 1 < i + 4) {
        // Currently in progress, mark sess end date and stop loop
        sessions[sessions.length - 1]['end'] = logLines[i].substr(0, 24);
        break;
      }
      const r_start = line.substr(0, 24);
      const r_end = logLines[i + 1].substr(0, 24);
      if(new Date(r_end) - new Date(r_start) < 12*3600*1000) {
        sessions[sessions.length - 1].renders.push({
          start: r_start,
          end: r_end,
          duration: new Date(r_end) - new Date(r_start),
          success: logLines[i + 4].includes('finishing job'),
        });
      }
    } else if (logLines.length - 2 == i) {
      sessions[sessions.length - 1]['end'] = logLines[i].substr(0, 24);
      break;
    }
  }
  for (let index = 0; index < sessions.length; index++) {
    const session = sessions[index];
    session['total_renders'] = session.renders.length;
    session['renders_uploaded'] = session.renders.filter(
      (r) => r.success
    ).length;
    session['renders_failed'] = session.renders.filter(
      (r) => !r.success
    ).length;
    session['duration'] = new Date(session.end) - new Date(session.start);
    session['render_time'] = session.renders
      .filter((r) => r.success)
      .reduce((prev, next) => prev + next.duration, 0);
  }
  return sessions;
};
