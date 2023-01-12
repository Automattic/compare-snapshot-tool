import { useState } from "react";
import { Download, Navigation, SitePreview} from "./index.js";
import Papa from "papaparse";

const Actions = (props) => {
    return (
        <div className="action">
            <button className="accept" onClick={props.onAccept}>Accept</button>
            <button className="reject" onClick={props.onReject}>Reject</button>
        </div>
    )
}

const Skip = (props) => {
    return (
        <div className="skip">
            <p>To skip to the item without status: </p>
            <button className="skip-button" onClick={props.onSkip}>Skip</button>
        </div>
    )
}

function Modal(props) {
    const [newData, setNewData] = useState([...props.parsedData])
    const [activeData, setActiveData] = useState(0);

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

    const handleNextData = () => {
        const length = newData.length;
        var index = activeData + 1;
        index = index % length;
        setActiveData(index);
    }


    const handlePreviousData = () => {
        const length = newData.length;
        var index = activeData;
        index = index === 0 ? length - 1 : index - 1;
        setActiveData(index);
    }

    const handleSkip = () => {
        let index = newData.findIndex( (data, idx) => idx > activeData && (data.status === '' || data.status === undefined));
        if (index > 0) {
            setActiveData(index);
        }
    }

    const handleModalClose = () => {
        handleDownload();
        window.location.reload(false);
    }

    const handleDownload = () => {
        const finalData = Papa.unparse(newData);
        const csvContent = `data:text/csv;charset=utf-8,${finalData}`;
        const encodedURI = encodeURI(csvContent);
        window.open(encodedURI);
      }
    return (
        <div id='modal'>
            <h2>Compare these pages!</h2>
            <div>
                <div id="status">
                    <span id="status-text"></span>
                    <p>
                    <strong>Status:</strong> {newData[activeData].status}
                    </p>
                    <Actions 
                        onAccept={handleAccept}
                        onReject={handleReject}
                    />
                </div>
                <SitePreview 
                    activeData={activeData}
                    oldUrl={newData[activeData].oldUrl}
                    newUrl={newData[activeData].newUrl}
                />
                <Skip onSkip={handleSkip}/>
                <Download onDownload={handleDownload}/>
                <Navigation
                    onNext={handleNextData}
                    onClose={handleModalClose}
                    onPrev={handlePreviousData}
                />
            </div>
        </div>
    );
}

export default Modal;