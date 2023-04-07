import { useState } from 'react';
import axios from 'axios';
import { Input, Button } from '@material-ui/core';

export default function photoUpload() {
  const [file, setFile] = useState();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'rocketship');
    let data = '';
    await axios
      .post('https://api.cloudinary.com/v1_1/dbq7yg58d/image/upload/', formData)
      .then((response) => {
        data = response.data['secure_url'];
      });
    console.log(data);
    return data;
  };

  return (
    <div>
      <Input type="file" onChange={handleFileChange} />

      <div>{file && `${file.name} - ${file.type}`}</div>

      <Button variant="contained" color="primary" onClick={handleUploadClick}>
        Upload
      </Button>
    </div>
  );
}
