
import "./App.css";
import { useState } from "react";
import Papa from "papaparse";

const Header = (props) => {
  return (
    <header>
      <h1>{props.title}</h1>
      <p>{props.message}</p>
    </header>
  );
}

function FileUpload(props) {
  return(
    <div>
      <p>File name: {props.fileName}</p>
      <p>File type: {props.fileType}</p>
      <p>Size in bytes: {props.fileSize}</p>
      <p>
        Last modified date:{' '}
        {props.fileDate}
      </p>
    </div>
   )
}

const Instructions = (props) => {
  return (
    <div className='image-comparison-tool'>
      <h2>Upload a CSV file to start comparing images</h2>
      <p>This tool will display a side-by-side snapshot of two URLs from CSV.</p>
      <h3>How to use</h3>
      <ol>
        <li>Prepare your CSV file with the following columns: <code>oldUrl</code>, <code>newUrl</code>, <code>status</code>.</li>
        <li>Upload your CSV file.</li>
        <li>You can view the results by clicking on the <b>Previous</b> and <b>Next</b> buttons.</li>
        <li>To add a status or test result, click on <b>Accept</b> button to mark the data as passed. Otherwise, click on the <b>Reject</b> button.</li>
        <li>Once you are done, download the CSV file.</li>
      </ol>
      
    </div>
  )
}
const Navigation = (props) => {
  return (
    <div className="navigation">
      <button onClick={props.onPrev}>{'\u2B05'} Previous</button>
      <button onClick={props.onModalClose}>Close</button>
      <button onClick={props.onNext}>Next {'\u27A1'}</button>    
    </div>
  )
}

const Download = (props) => {
  return (
    <div className="download">
      <button id="downloadBtn" onClick={props.onDownload} value="download">Download</button>
    </div>
  )
}

const Preview = (props) => {
  return (
    <div id="preview-all">
      <div className="column">
        <p>
          <strong>PAGE {props.activeData + 1}:</strong>
          <a href={props.oldUrl}> {props.oldUrl}</a>
        </p>
        <iframe title="preview-0" className="preview" src={'https://image.thum.io/get/width/1024/fullpage/allowJPG' + props.oldUrl} width="100%" height="500" />
      </div>
      <div className="column">
        <p>
          <strong>PAGE {props.activeData + 1}:</strong>
          <a href={props.newUrl}> {props.newUrl}</a>
        </p>
        <iframe title="preview-1" className="preview" src={'https://image.thum.io/get/width/1024/fullpage/allowJPG' + props.newUrl} width="100%" height="500" />
      </div>
    </div>
  )
}

const Modal = (props) => {
  return (
      <div>
        <div id="status">
          <span id="status-text"></span>
          <p>
            <strong>Status:</strong> {props.status}
          </p>
        </div>
        <div className="action">
          <button className="accept" onClick={props.onAccept}>Accept</button>
          <button className="reject" onClick={props.onReject}>Reject</button>
        </div>
        <Preview {...props}></Preview>
        <div className="skip">
          <p>To skip to the item without status: </p>
          <button className="skip-button" onClick={props.onSkip}>Skip</button>
        </div>
        <Download 
          onDownload={props.onDownload}>
        </Download>
        <Navigation {...props}></Navigation>
      </div>
  );
}

function App() {
  const [parsedData, setParsedData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [activeData, setActiveData] = useState('');
  const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [oldUrl, setOldUrl] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [status, setStatus] = useState('');

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setParsedData(results.data);
        setNewData(results.data);
      },
    });

  }
  
  const handleSubmission = () => {
    setActiveData(0);
    handleData(0);
	}

  const handleModalClose = () => {
    setActiveData('');
    setIsFilePicked(false);
    handleDownload();
  }

  const handleNextData = () => {
    const length = parsedData.length;
    var index = activeData + 1;
    index = index % length;
    setActiveData(index);
    handleData(index);
  }

  const handlePreviousData = () => {
    const length = parsedData.length;
    var index = activeData;
    index = index === 0 ? length - 1 : index - 1;
    setActiveData(index);
    handleData(index);
  }

  function handleData(index) {
    setOldUrl(parsedData[index].oldUrl);
    setNewUrl(parsedData[index].newUrl);
    setStatus(newData[index].status);
  }

  const handleAccept = () => {
    setNewData(prevNewData => prevNewData.map((data, i) => {
      if (i === activeData) {
        return {
          ...data,
          status: 'PASSED'
        }
      }
      return data;
    }));
    handleNextData();
  }

  const handleReject = () => {
    setNewData(prevNewData => prevNewData.map((data, i) => {
      if (i === activeData) {
        return {
          ...data,
          status: 'FAILED'
        }
      }
      return data;
    }));
    handleNextData();
  }

  const handleDownload = () => {
    const finalData = Papa.unparse(newData);
    const csvContent = `data:text/csv;charset=utf-8,${finalData}`;
    const encodedURI = encodeURI(csvContent);
    window.open(encodedURI);
  }

  const handleSkip = () => {
    let index = newData.findIndex(data => data.status === '' || data.status === undefined) ;
    if (index > 0) {
      setActiveData(index);
      handleData(index);
    }
  }

  return (
    <div id="main-app">
      <Header 
        title="Image Comparison Tool" 
      />
      { activeData === '' ? (
        <div className='image-comparison-tool'>
          <Instructions />
          <input type="file" name="file" className="input-file" onChange={changeHandler} accept=".csv" />
          { isFilePicked ? (
            <FileUpload  
              fileName={selectedFile.name}
              fileType={selectedFile.type}
              fileSize={selectedFile.size}
              fileDate={selectedFile.lastModifiedDate.toLocaleDateString()}
            />
          ) : (
            <div>
              <p>Select a file to show details</p>  
            </div>
          )}
          <button onClick={handleSubmission}>Start comparing images</button>
        </div>
      ) : (
        <div id='modal'>
          <h2>Compare these pages!</h2>
          <Modal 
            status={status}
            oldUrl={oldUrl}
            newUrl={newUrl}
            onModalClose={handleModalClose}
            onNext={handleNextData}
            onPrev={handlePreviousData}
            onAccept={handleAccept}
            onReject={handleReject}
            onDownload={handleDownload}
            onSkip={handleSkip}
            activeData={activeData}
          />
        </div>
      )}
    </div>
  )
}

export default App;