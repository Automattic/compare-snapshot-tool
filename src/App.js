
import "./App.css";
import { Instructions, Modal } from "./components";
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

const Data = (props) => {
  const data = props.data;
  const getTotalPassed = () => {
    return data.filter((item) => item.status === "PASSED").length;
  }

  const getTotalFailed = () => {
    return data.filter((item) => item.status === "FAILED").length;
  }
  return(
    <div>
      <p>Number of items: {props.data.length}</p>
      <p>Total passed: {getTotalPassed()}</p>
      <p>Total failed: {getTotalFailed()}</p>
    </div>
   )
}

const Home = (props) => {
  return (
    <div className='image-comparison-tool'>
      <Instructions />
      <input type="file" name="file" className="input-file" onChange={props.onChange} accept=".csv" />
      { props.selectedFile !== undefined ? (
        <Data  
          data={props.data}
        />
      ) : (
        <div>
          <p>Select a file to show details</p>  
        </div>
      )}
      <button onClick={props.onClick}>Start comparing images</button>
    </div>
  )
}

function App() {
  const [parsedData, setParsedData] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState();

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setParsedData(results.data);
      },
    });

  }
  
  const handleSubmission = () => {
    if (selectedFile !== undefined) {
      setIsActive(true);
    } else {
      alert("Please select a file first.")
    }
	}

  return (
    <div id="main-app">
      <Header title="Image Comparison Tool" />
      { !isActive ? (
        <Home 
          data={parsedData}
          selectedFile={selectedFile}
          onChange={changeHandler}
          onClick={handleSubmission}
        />
      ) : (
        <Modal parsedData={parsedData}/>
      )}
    </div>
  )
}

export default App;