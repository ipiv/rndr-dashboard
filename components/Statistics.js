import { useState, useEffect } from "react";

export default function Statistics(props) {
  let data = props.logData
  const logLines = data.split(/\r?\n/);

  return(
    <div>
      <p>Your log has {logLines.length} lines</p>
      <p>Functionality coming soon!</p>
    </div>
  )
}