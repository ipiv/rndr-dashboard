import {useMemo, useState, useCallback } from 'react';
import {useDropzone} from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '3rem',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: 'rgb(157 157 157)',
  borderStyle: 'dashed',
  backgroundColor: 'rgb(18 21 35)',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer',
  height: '100%',
  width: '100%',
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

function StyledDropzone(props) {

  const onDropAccepted = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => handleLogData(new Error('File reading was Aborted'))
      reader.onerror = () => handleLogData(new Error('File reading has Failed'))
      reader.onload = () => {
        const log = reader.result
        props.handleLogData(log)
      }
      reader.readAsText(file)
    })
    
  }, [])
  
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    isFocused
  } = useDropzone({accept: 'text/plain', onDropAccepted});

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive || isFocused ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragAccept,
    isDragReject,
    isFocused
  ]);

  return (
    <div className="container-dropzone" style={{padding: '3rem 0'}} onClick={() => {navigator.clipboard.writeText('%LOCALAPPDATA%\\OtoyRndrNetwork')}}>
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
            <p>Drag {'&'} drop your <span style={{color: '#0070f3'}}>rndr_log.txt</span> or Click here</p>
            {isDragReject 
            ? <p>😟That's not the correct RNDR log file</p> 
            : (<p>You can find it at: {' '}
              <code style={{backgroundColor: 'rgb(0 112 243 / 3%)', padding: '5px', color: '#0070f3'}}>%LOCALAPPDATA%\OtoyRndrNetwork</code><code>{' '}📋copied on click</code>
              </p>)}
      </div>
    </div>
  );
}

export default StyledDropzone