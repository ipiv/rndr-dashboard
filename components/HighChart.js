import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

if (typeof Highcharts === 'object') {
  Highcharts.setOptions({
    title: {
      style: {
        "color": "#edebe8"
      }
    },
    credits: {
      enabled: false
    },
    tooltip: {
      shared: true,
      crosshairs: true,
    },
    chart: {
      height: 300,
      width: 400,
      backgroundColor: 'transparent',
      zoomType: 'x'
    },
    yAxis: {
      gridLineColor: '#353535'
    },
    xAxis: {
      type: 'datetime',
    },
    plotOptions: {
      series: {
        marker: {
          fillColor: '#FFFFFF',
          lineWidth: 2,
          lineColor: null,
          states: {
          }
        }
      }
    }
  })
}
const Highchart = ({opts}) => {
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={opts}
    />
  )
}
export default Highchart