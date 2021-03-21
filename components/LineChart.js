import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, Crosshair} from 'react-vis';
import { useState } from 'react'


const LineChart = ({data}) => {
  const [crosshairValues, setCrossHairValues] = useState([]);
  const _onMouseLeave = () => {
    setCrossHairValues([]);
  };
  const _onNearestX = (value, {index}) => {
    console.log(index)
    setCrossHairValues(data.map(d => d[index]));
    console.log(crosshairValues)
  };

  return (
    <XYPlot onMouseLeave={_onMouseLeave} height={300} width={300}>
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis />
      <YAxis />
      <LineSeries onNearestX={_onNearestX} data={data[0]} />
      <LineSeries data={data[1]} />
      <Crosshair
        values={crosshairValues}
        className={'test-class-name'}
      />
    </XYPlot>
  )
}

export default LineChart