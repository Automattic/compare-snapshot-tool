
import "./App.css";
import { Instructions, Modal } from "./components";
import { useState } from "react";
import Papa from "papaparse";
import generateMShotsUrl from "./lib/mShots";

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

const dataIsSet = (data) => data && data.length > 0

const Home = (props) => {
	const handleChange = (event) => {
    const requiredHeaders = ['oldUrl', 'newUrl', 'status', 'comment'];
		const file = event.target.files[0]
		if (!file) {
			props.setData([]);
			return;
		}

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const headers = results.meta.fields;
				let isValid = true;
				// All of the required headers must be present...
				for (const requiredHeader of requiredHeaders) {
					if (!headers.includes(requiredHeader)) {
						isValid = false;
					}
				}
				// ... And there shouldn't be other excess headers
				if (headers.length !== requiredHeaders.length) {
					isValid = false;
				}

				if (isValid) {
					props.setData(results.data);
				} else {
					// You can't control file state directly in react, so we wipe the event value to reset the native HTML input state.
					event.target.value = null;
					props.setData([]);
					alert("Please check the headers in the CSV file. The required headers are: oldUrl, newUrl, status, comment");
				}
      },
    });
  }


  return (
    <div className='image-comparison-tool'>
      <Instructions />
      <input type="file" name="file" className="input-file" onChange={handleChange} accept=".csv" />
      { dataIsSet(props.data) ? (
        <Data data={props.data}/>
      ) : (
        <div>
          <p>Select a file to show details</p>  
        </div>
      )}
      <button onClick={props.onSubmission}>Start comparing images</button>
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
			const response = await fetch(generateMShotsUrl(url));
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
  const [appStage, setAppStage] = useState('HOME')
  
	const handleSubmission = () => {
		if (!dataIsSet(parsedData)) {
			alert("Please select a file first.");
		}
		else {
			setAppStage('LOADING');
			preFetchUrls(parsedData);
			waitForFirstUrls(parsedData).then(() => {
				setAppStage('MODAL');
			})
		}
	}

	let mainDisplay = null;
	switch (appStage) {
		case 'LOADING': {
			mainDisplay = <Loading />;
			break;
		}
		case 'MODAL': {
			mainDisplay = <Modal parsedData={parsedData}/>;
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
    <div id="main-app">
      <Header title="Image Comparison Tool" />
			{mainDisplay}
    </div>
  )
}

export default App;