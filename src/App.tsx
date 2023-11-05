import { useState, ChangeEvent } from 'react';

import './App.css';

const modelOptions: string[] = [
  '500_200',
  '200_5',
];

function App(): JSX.Element {
  const [isSending, setIsSending] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);
  const [model, setModel] = useState<string>(modelOptions[0]);
  const [responseImageUrl, setResponseImageUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) {
      setModel(event.target.value);
      console.log(model);
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        setIsSending(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', model);

        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData
        });

        setIsSending(false);

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
    <div className='container'>
      <span>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={isSending} >{isSending ? 'Sending...' : 'Upload'}</button>
      </span>
      <span>
        Select the model:
        <select name="models" id="mode" onChange={handleModelChange}>
          {modelOptions.map((modelOption) => (
            <option value={modelOption}>{modelOption}</option>
          ))}
        </select>
      </span>
      <span className='images'>

        <div className='image'>
          {responseImageUrl && 'Original'}
          {uploadedImageUrl && <img src={uploadedImageUrl} alt="Uploaded" style={{ maxWidth: '100%' }} />}
        </div>

        <div className='image'>
          {responseImageUrl && 'Predicted'}
          {responseImageUrl && <img src={responseImageUrl} alt="Response" style={{ maxWidth: '100%' }} />}
        </div>

      </span>
    </div>
  );
}

export default App;
