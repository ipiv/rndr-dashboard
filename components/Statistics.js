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
      renders_uploaded: active_sessions.reduce(
          (prev, next) => prev + next.renders_uploaded,
          0
      ),
      renders_failed: sessions.reduce(
          (prev, next) =>
            prev + next.renders_failed,
          0
      ),
      uptime: sessions.reduce((prev, next) => prev + next.duration, 0),
      rendertime_total: active_sessions.reduce(
          (prev, next) => prev + next.render_time,
          0
      ),
      obh_total: sessions.reduce((prev, next) => prev + next.obh, 0),
      last_ob_score: active_sessions.slice().reverse().find(sess => sess.ob_score).ob_score
  }
  const chartData = [
    {
      chart: {
        inverted: false
      },
      title: {
        text: 'Renders',
      },
      yAxis: [
        {
          title: {
            text: 'Renders'
          }
        },
        {
          visible: false,
          softMax: 10
        }
      ],
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
          type: 'column',
          yAxis: 1,
          data: sessions.map((sess) => [
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
        text: 'RenderTime current/last Session'
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

  return (
    <div className={styles.container}>
      <div className={styles.overview}>
        <div><h4>Sessions</h4>{overview.sessions_total}</div>
        <div><h4>Failed / Uploaded</h4>{overview.renders_failed} / {overview.renders_uploaded}</div>
        <div><h4>Utilization</h4>{(overview.rendertime_total/overview.uptime*100).toFixed(2)}%</div>
        <div><h4>Last OB score</h4>{overview.last_ob_score}</div>
        <div><h4>RNDR earned* T{overview.last_ob_score > 300 ? '2' : '3'}</h4>{(overview.obh_total / (overview.last_ob_score > 300 ? 100 : 200)).toFixed(2)} tokens</div>
        <div><h4>Uptime:</h4> 
          {msToDuration(overview.uptime)}
        </div>
        <div><h4>Render Time:</h4>
          {msToDuration(overview.rendertime_total)}
        </div>
        <div><h4>Idle Time:</h4>
            {msToDuration(overview.uptime - overview.rendertime_total)}
        </div>
        
      </div>
      <div className={styles.chartsContainer}>
        {chartData.map((d,i) => <Highchart opts={d} key={i}/>)}
      </div>
    </div>
  )
}
