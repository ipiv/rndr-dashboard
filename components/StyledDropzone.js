import {useMemo, useState, useCallback } from 'react';
import {useDropzone} from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: 'rgb(121 121 121)',
  borderStyle: 'dashed',
  backgroundColor: 'rgb(34 35 43)',
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
    <div className="container-dropzone">
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
            <p>Drag 'n' drop your <span style={{color: '#0070f3'}}>rndr_log.txt</span> or click</p>
            {isDragReject ? <p>😟That's not the correct RNDR log file</p> : (<p>You can find it at <code style={{backgroundColor: 'rgb(0 112 243 / 3%)', padding: '5px'}}>%LOCALAPPDATA%\OtoyRndrNetwork</code></p>)}
      </div>
    </div>
  );
}

export default StyledDropzone