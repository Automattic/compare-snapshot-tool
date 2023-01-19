
import "./App.css";
import { FileUpload, Instructions, Modal } from "./components";
import { useCallback, useState } from "react";
import Papa from "papaparse";
import generateMShotsUrl from "./lib/mShots";
import { REQUIRED_HEADERS } from "./constants/constants";

const dataIsSet = (data) => data && data.length > 0

const Home = (props) => {
	const [usemShots, setUsemShots] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");
	const handleChange = useCallback((event) => {
		const file = event.target.files[0]
		if (!file) {
			props.setData([]);
      setFileName("No file chosen");
			return;
		}

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const headers = results.meta.fields;
				let isValid = true;
				// All of the required headers must be present...
				for (const requiredHeader of REQUIRED_HEADERS) {
					if (!headers.includes(requiredHeader)) {
						isValid = false;
					}
				}
				// ... And there shouldn't be other excess headers
				if (headers.length !== REQUIRED_HEADERS.length) {
					isValid = false;
				}

				if (isValid) {
					props.setData(results.data);
          setFileName(file.name);
				} else {
					// You can't control file state directly in react, so we wipe the event value to reset the native HTML input state.
					event.target.value = null;
					props.setData([]);
          setFileName("No file chosen");
          const message = "Please check the headers in the CSV file. The required headers are: " + REQUIRED_HEADERS.join(", ");
					alert(message);
				}
      },
    });
  }, [props]);


  return (
    <div className='compare-snapshot-tool'>
      <Instructions />
      <FileUpload 
        data={props.data}
        fileName={fileName}
        onHandleChange={handleChange}
        dataIsSet={dataIsSet(props.data)}
      />
      <div className='options'>
        <label>
          <input type="checkbox" id="checkbox" checked={usemShots} onChange={event => setUsemShots(event.target.checked)} />
          <span> Use snapshots only</span>
        </label>
      </div>
      <button onClick={() => props.onSubmission(usemShots)}>Compare</button>
    </div>
  )
}

const Loading = () => {
	return (
		<div className="loading-panel">
			<span className="loading-icon">&#10710;</span>
			<p className="loading-message">Preparing the snapshots...</p>
		</div>
	)
}

const noop = () => {}

const preFetchUrls = (data) => {
	const dataWithoutStatus = data.filter((item) => item.status === "");
	const urlsToPreFetch = new Set();
	dataWithoutStatus.forEach((item) => {
		// Add to set to prune any duplicates and avoid pointless web requests
		urlsToPreFetch.add(item.oldUrl);
		urlsToPreFetch.add(item.newUrl);
	})

	urlsToPreFetch.forEach((url) => {
		// TODO: if the pre-fetching fails, we can optionally log something if we want
		fetch(generateMShotsUrl(url)).catch(noop);
	})
}

const waitForFirstUrls = async (data) => {
	const firstData = data?.[0];
	if (!firstData) {
		return;
	}

	const fetchUntilNotRedirected = async (url) => {
		const maxAttempts = 15;

		const wait = (ms) => new Promise((res) => {
			setTimeout(res, ms);
		})

		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			const mshotsUrl = generateMShotsUrl(url);
			const response = await fetch(mshotsUrl, { mode: 'no-cors' });
				if (!response.redirected) {
					// Even once mShots stops redirecting, there can be a race condition sometimes
					// when you return immediately. Adding one small pauses right before returning helps
					// make the iframes more consistent.
					await wait(500);
					return;
				}
			
			await wait(1000);
		}
	}

	await Promise.all([
		fetchUntilNotRedirected(firstData.oldUrl),
		fetchUntilNotRedirected(firstData.newUrl)
	]);
}

function App() {
  const [parsedData, setParsedData] = useState([]);
  const [appStage, setAppStage] = useState('HOME');
  const [usemShots, setUsemShots] = useState(false);
  
	const handleSubmission = (usemShots) => {
		setUsemShots(usemShots);
		
		if (!dataIsSet(parsedData)) {
			alert("Please select a file first.");
		}
		else {
			if(usemShots) {
				setAppStage('LOADING');
				preFetchUrls(parsedData);
				waitForFirstUrls(parsedData).then(() => {
					setAppStage('MODAL');
				})
			} else {
				setAppStage('MODAL');
			}			
		}
	}

	let mainDisplay = null;
	switch (appStage) {
		case 'LOADING': {
			mainDisplay = <Loading />;
			break;
		}
		case 'MODAL': {
			mainDisplay = <Modal parsedData={parsedData} usemShots={usemShots} />
			break;
		}
		case 'HOME': 
		default: {
			mainDisplay = <Home 
				data={parsedData}
				setData={setParsedData}
				onSubmission={handleSubmission}
			/>;
			break;
		}
	}

  return (
    <div id="main-app" data-testid="main-app">
			{mainDisplay}
    </div>
  )
}

export default App;