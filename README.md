## Can't quarantee accurate data
⚠ RNDR client log files are currently missing AM/PM indicators, which makes it hard to parse exact datetimes.

I made an effort to offset the timestamps in case the session had a shift from 12 o'clock to 01 in it but there were still issues with overlapping timestamps when the sessions were less than 12 hours long, didn't include a shift or in a case where shift occured during render process. (could be a 12+hr render)

For example, shifts that can be used to accurately determine current time of day:
```
15-03-2021 12:57:10 INFO:
15-03-2021 01:02:35 INFO:
# or
15-03-2021 12:57:10 INFO:
16-03-2021 01:02:35 INFO:
```
One of the solutions would be to provide a local executable that helps with tracking node state and logs/reports possibly even more useful data.

RNDR team has announced of a plan to launch a dashboard for Node operators,
therefore I'm currently putting development to pause until we see what functionality they provide and if it can be improved/built upon.

## Getting Started

```bash
npm run dev
# or
yarn dev
```
