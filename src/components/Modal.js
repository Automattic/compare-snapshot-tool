import { useState } from "react";
import { Download, Navigation, Popup, SitePreview } from "./index.js";
import Papa from "papaparse";

const Actions = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="action">
            <button className="accept" onClick={props.onAccept}>Accept</button>
            <button className="reject" onClick={() => setIsOpen(true)}>Reject</button>
            {isOpen ? <Popup 
                title="Hello there!" 
                closePopup={() => setIsOpen(false)} 
                onReject={props.onReject}
                value={props.currentComment}
            /> 
            : null}
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
        const prevFailureMessage = "Previous failure message - ";
        let comment = newData[activeData].comment;
        let finalComment = comment;
        if ( newData[activeData].status === 'FAILED' && comment.length > 0 ) {
            finalComment = prevFailureMessage.concat(comment);
        }

        setNewData(prevNewData => prevNewData.map((data, i) => {
          if (i === activeData) {
            return {
              ...data,
              status: 'PASSED',
              comment: finalComment
            }
          }
          return data;
        }));
      }
    
    const handleReject = (comment) => {
        setNewData(prevNewData => prevNewData.map((data, i) => {
            if (i === activeData) {
            return {
                ...data,
                status: 'FAILED',
                comment: comment
            }
            }
            return data;
        }));
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
                        <strong>Status: </strong>{newData[activeData].status}
                    </p>
                    <p>
                        <strong>Comment: </strong>{newData[activeData].comment}
                    </p>
                    <Actions 
                        onAccept={handleAccept}
                        onReject={handleReject}
                        currentComment={newData[activeData].comment}
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