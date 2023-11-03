import React, { useState, ChangeEvent } from 'react';

function App(): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [responseImageUrl, setResponseImageUrl] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
  
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData
        });
  
        // Assuming the response is an image
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
  
        setUploadedImageUrl(URL.createObjectURL(file));
        setResponseImageUrl(imageUrl);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      Original
      {uploadedImageUrl && <img src={uploadedImageUrl} alt="Uploaded" style={{ maxWidth: '100%' }} />}
      Predicted
      {responseImageUrl && <img src={responseImageUrl} alt="Response" style={{ maxWidth: '100%' }} />}
    </div>
  );
}

export default App;
