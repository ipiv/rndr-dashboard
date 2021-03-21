import { ResponsiveLine } from '@nivo/line'

const CustomSymbol = ({ size, color, borderWidth, borderColor }) => (
  <g>
      <circle fill="#fff" r={size / 2} strokeWidth={borderWidth} stroke={borderColor} />
      <circle
          r={size / 5}
          strokeWidth={borderWidth}
          stroke={borderColor}
          fill={color}
          fillOpacity={0.35}
      />
  </g>
)

const BarChart = ({ data /* see data tab */ }) => (
  <ResponsiveLine
      data={data}
      theme={
        { 
          tooltip: {
            container: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: '#f4f4f4'
            }
          },
          grid: {
            line: {
              stroke: "rgba(0, 0, 0, 0.4)"
            }
          },
          textColor: '#9a9a9a'
        }
      }
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'time', format: '%m-%d-%Y %H:%M:%S', useUTC: false, precision: 'second'}}
      xFormat="time:%m-%d-%Y %H:%M:%S"
      yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: '%b %d',
        tickValues: 'every 2 days',
        legend: 'time scale',
        legendOffset: -12,
      }}
      axisLeft={{
        legend: 'linear scale',
        legendOffset: 12,
      }}
      curve={'monotoneX'}
      enablePointLabel={true}
      pointSymbol={CustomSymbol}
      pointSize={16}
      pointBorderWidth={1}
      pointBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.3]],
      }}
      useMesh={true}
      enableSlices={false}
  />
)

export default BarChart