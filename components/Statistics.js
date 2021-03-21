import Highchart from '../components/HighChart'
import { parseLog } from '../helpers/parseLog'
import { msToDuration } from '../helpers/msToDuration'

export default function Statistics(props) {
  const data = props.logData
  const sessions = parseLog(data)
  const active_sessions = sessions.filter((sess) => sess.renders.length)
  const overview = {
      sessions_total: sessions.length,
      sessions_active: active_sessions.length,
      renders_success: active_sessions.reduce(
          (prev, next) => prev + next.renders.length,
          0
      ),
      renders_failed: active_sessions.reduce(
          (prev, next) =>
            prev + next.renders.filter((render) => !render.success).length,
          0
      ),
      uptime: active_sessions.reduce((prev, next) => prev + next.duration, 0),
      rendertime_total: active_sessions.reduce(
          (prev, next) => prev + next.render_time,
          0
      ),
  }
  const chartData = [
    {
      title: {
        text: 'Renders',
      },
      yAxis: {
        title: {
          text: 'Renders'
        }
      },
      series: [
        {
          name: 'Uploaded',
          color: '#00E676',
          type: 'spline',
          data: active_sessions.map((sess) => [
            (new Date(sess.start).getTime() +
              new Date(sess.end).getTime()) /
              2,
            sess.renders_uploaded,
          ]),
        },
        {
          name: 'Failed',
          color: '#E61034',
          type: 'spline',
          data: active_sessions.map((sess) => [
            (new Date(sess.start).getTime() +
              new Date(sess.end).getTime()) /
              2,
            sess.renders_failed,
          ]),
        },
      ],
    },
    {
      title: {
        text: 'RenderTime'
      },
      yAxis: { labels: { format: '{value} hrs' } },
      tooltip: { valueSuffix: ' hrs', valueDecimals: 2 },
      series: [
        {
          name: 'RenderTime',
          color: '#00AAE6',
          type: 'spline',
          data: active_sessions.map((sess) => [
            (new Date(sess.start).getTime() +
              new Date(sess.end).getTime()) /
              2,
            sess.render_time / (3600 * 1000),
          ]),
        },
      ],
    },
  ]

  return (
    <div>
      <div>
        <p>Total Sessions: {overview.sessions_total}</p>
        <p>Active Sessions: {overview.sessions_active}</p>
        <p>Renders Uploaded: {overview.renders_success}</p>
        <p>Renders Failed: {overview.renders_failed}</p>
        <p>
          Uptime: {msToDuration(overview.uptime)} (
          {(overview.uptime / (1000 * 3600)).toFixed(2)} hrs)
        </p>
        <p>
          Time spent rendering:{' '}
          {msToDuration(overview.rendertime_total)} (
          {(overview.rendertime_total / (1000 * 3600)).toFixed(2)}{' '}
          hrs)
        </p>
        <p>
          Time spent idling/preparing:{' '}
          {msToDuration(overview.uptime - overview.rendertime_total)}{' '}
          (
          {(
            (overview.uptime - overview.rendertime_total) /
            (1000 * 3600)
          ).toFixed(2)}{' '}
          hrs)
        </p>
      </div>

      <div
        style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '800px' }}
      >
        <Highchart
          opts={chartData[0]}
        />
        <Highchart
          opts={chartData[1]}
        />
      </div>
    </div>
  )
}
