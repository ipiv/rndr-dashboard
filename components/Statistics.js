import Highchart from '../components/HighChart'
import { parseLog } from '../helpers/parseLog'
import { msToDuration } from '../helpers/msToDuration'
import styles from '../styles/Statistics.module.css'

export default function Statistics(props) {
  const data = props.logData
  const sessions = parseLog(data)
  const active_sessions = sessions.filter((sess) => sess.render_time)
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
      last_ob_score: sessions.slice().reverse().find(sess => sess.ob_score).ob_score || 0
  }
  const allRenders = sessions.reduce((prev, next) => prev.concat(...next.renders), []);
  const renderTimePerDay = {};
  allRenders.forEach(render => {
    const day = new Date(render.end).toLocaleDateString()
    if (render.success) {
        renderTimePerDay[day] = renderTimePerDay[day] || 0;
        renderTimePerDay[day] += render.duration
    }
  });
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
          softMax: 20
        }
      ],
      xAxis: { visible: false},
      series: [
        {
          stacking: 'normal',
          name: 'Uploaded',
          color: '#00E676',
          type: 'column',
          data: sessions.map((sess) => [
            `Start: <b>${new Date(sess.start).toLocaleString()}</b><br/>End: <b>${new Date(sess.end).toLocaleString()}</b>`,
            sess.renders_uploaded,
          ]),
        },
        {
          stacking: 'normal',
          name: 'Failed',
          color: '#E61034',
          type: 'column',
          yAxis: 1,
          data: sessions.map((sess) => [
            `Start: <b>${new Date(sess.start).toLocaleString()}</b><br/>End: <b>${new Date(sess.end).toLocaleString()}</b>`,
            sess.renders_failed,
          ]),
        },
      ],
    },
    {
      title: {
        text: 'Utilization per Session'
      },
      yAxis: { labels: { format: '{value} %' } },
      xAxis: {type: 'category', visible: false},
      tooltip: { 
        valueSuffix: '%',
        valueDecimals: 2,
        pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/><span style="color:#E72647">●</span> Tokens: <b>{point.z:.2f} RNDR</b><br/>'
      },
      series: [
        {
          name: 'Utilization',
          color: '#00AAE6',
          type: 'column',
          tooltip: { valueSuffix: ' %', valueDecimals: 2, },
          data: sessions.filter(sess => sess.render_time && sess.duration > sess.render_time).map(sess => ({
            name: `Start: <b>${new Date(sess.start).toLocaleString()}</b><br/>End: <b>${new Date(sess.end).toLocaleString()}</b>`,
            y: (sess.render_time / sess.duration) * 100,
            z: (sess.ob_score * sess.render_time) / (3600 * 1000) / (sess.ob_score > 300 ? 100 : 200)
          })),
        },
      ],
    },
    {
      title: {
        text: 'RenderTime per Session'
      },
      yAxis: { labels: { format: '{value} hrs' } },
      tooltip: { 
        valueSuffix: ' hrs',
        valueDecimals: 2,
        pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/><span style="color:#E72647">●</span> Tokens: <b>{point.z:.2f} RNDR</b><br/>'
      },
      xAxis: { visible: false},
      series: [
        {
          name: 'RenderTime',
          color: '#00AAE6',
          type: 'column',
          data: active_sessions.map((sess) => ({
            name: `Start: <b>${new Date(sess.start).toLocaleString()}</b><br/>End: <b>${new Date(sess.end).toLocaleString()}</b>`,
            y: sess.render_time / (3600 * 1000),
            z: (sess.ob_score * sess.render_time) / (3600 * 1000) / (sess.ob_score > 300 ? 100 : 200)
          })),
        },
      ],
    },
    {
      title: {
        text: 'RenderTime per day'
      },
      yAxis: { labels: { format: '{value} hrs' } },
      xAxis : {type: 'datetime'},
      tooltip: { 
        valueSuffix: ' hrs',
        valueDecimals: 2,
        xDateFormat: '%a, %e.%b %Y',
      },
      series: [
        {
          name: 'RenderTime',
          color: '#00AAE6',
          type: 'spline',
          data: Object.keys(renderTimePerDay).map(day => [new Date(day).getTime(), renderTimePerDay[day] / (3600 * 1000)])
        },
      ],
    },
    {
      title: {
        text: 'RenderTime - All'
      },
      yAxis: { labels: { format: '{value} hrs' } },
      tooltip: { 
        valueSuffix: ' hrs', 
        valueDecimals: 2, 
        pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/><span style="color:#E72647">●</span> Tokens: <b>{point.z:.2f} RNDR</b><br/>'
      },
      series: [
        {
          name: 'RenderTime',
          color: '#00AAE6',
          type: 'line',
          data: active_sessions.reduce((prev, next) => prev.concat(next.renders.map(render => ({
            x: new Date(render.start).getTime(),
            y: render.duration / (3600 * 1000),
            z: (next.ob_score * render.duration) / (3600 * 1000) / (next.ob_score > 300 ? 100 : 200)
          })
          )),[])
        },
      ],
    },
    {
      title: {
        text: 'RenderTime - current/last Session'
      },
      yAxis: { labels: { format: '{value} hrs' } },
      tooltip: { 
        valueSuffix: ' hrs', 
        valueDecimals: 2, 
        pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/><span style="color:#E72647">●</span> Tokens: <b>{point.z:.2f} RNDR</b><br/>'
      },

      series: [
        {
          name: 'RenderTime',
          color: '#00AAE6',
          type: 'column',
          data: active_sessions[active_sessions.length - 1].renders.map(render => ({
            x: new Date(render.start).getTime(),
            y: render.duration / (3600 * 1000),
            z: (overview.last_ob_score * render.duration) / (3600 * 1000) / (overview.last_ob_score > 300 ? 100 : 200)
          })),
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
