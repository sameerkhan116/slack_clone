import React from 'react';
import Dropzone from 'react-dropzone';

const FileUpload = ({ children, disableClick }) => (
  <Dropzone
    className="ignore"
    onDrop={file => console.log(file)}
    disableClick={disableClick}
  >
    {children}
  </Dropzone>
);

export default FileUpload;
