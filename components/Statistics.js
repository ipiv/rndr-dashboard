import Highchart from '../components/HighChart'
import { parseLog } from '../helpers/parseLog'
import { msToDuration } from '../helpers/msToDuration'
import styles from '../styles/Statistics.module.css'

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
        text: 'RenderTime per Session'
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
    {
      title: {
        text: 'RenderTime/All'
      },
      yAxis: { labels: { format: '{value} hrs' } },
      tooltip: { valueSuffix: ' hrs', valueDecimals: 2 },
      series: [
        {
          name: 'RenderTime',
          color: '#00AAE6',
          type: 'line',
          data: active_sessions.reduce((prev, next) => prev.concat(next.renders.map(render => [
            new Date(render.start).getTime(),
            render.duration / (3600 * 1000),
          ])),[])
        },
      ],
    },
    {
      title: {
        text: 'RenderTime last Session'
      },
      yAxis: { labels: { format: '{value} hrs' } },
      tooltip: { valueSuffix: ' hrs', valueDecimals: 2 },
      series: [
        {
          name: 'RenderTime',
          color: '#00AAE6',
          type: 'line',
          data: active_sessions[active_sessions.length - 1].renders.map(render => [
            new Date(render.start).getTime(),
            render.duration / (3600 * 1000),
          ]),
        },
      ],
    },
  ]
  console.log(sessions)
  console.log(chartData)

  return (
    <div className={styles.container}>
      <div className={styles.overview}>
        <div><h4>Total Sessions</h4> {overview.sessions_total}</div>
        <div><h4>Active Sessions:</h4> {overview.sessions_active}</div>
        <div><h4>Renders Uploaded:</h4> {overview.renders_success}</div>
        <div><h4>Renders Failed:</h4> {overview.renders_failed}</div>
        <div><h4>Uptime:</h4> 
          {msToDuration(overview.uptime)}
        </div>
        <div><h4>RenderTime:</h4>
          {msToDuration(overview.rendertime_total)}
        </div>
        <div><h4>IdleTime:</h4>
            {msToDuration(overview.uptime - overview.rendertime_total)}
        </div>
      </div>
      <div className={styles.chartsContainer}>
        {chartData.map((d,i) => <Highchart opts={d} key={i}/>)}
      </div>
    </div>
  )
}
