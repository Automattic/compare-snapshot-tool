import { useCallback, useState } from "react";
import { Download, Navigation, Popup, SitePreview } from "./index.js";
import Papa from "papaparse";

const Actions = (props) => {
    const [isOpen, setIsOpen] = useState(false);
	const {onReject, onAccept, currentComment} = props;

	const handlePopupSave = useCallback((comment) => {
		onReject(comment);
		setIsOpen(false);
	}, [onReject]);

	const handlePopupCancel = useCallback(() => {
		setIsOpen(false);
	}, [])

    return (
        <div className="action">
            <button className="accept" onClick={onAccept}>Accept</button>
            <button className="reject" onClick={() => setIsOpen(true)}>Reject</button>
            {isOpen ? <Popup 
                onSave={handlePopupSave} 
                onCancel={handlePopupCancel}
                startingComment={currentComment}
            /> 
            : null}
        </div>
    )
}

const Skip = (props) => {
    return (
        <div className="skip">
            <span>To skip to the item without status: </span>
            <button className="skip-button" onClick={props.onSkip}>Skip</button>
        </div>
    )
}

function Modal(props) {
    const [newData, setNewData] = useState([...props.parsedData])
    const [viewportWidth, setViewportWidth] = useState(1920);
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
            {!props.usemShots && <div>
                <label>
                    <p>Viewport width ({viewportWidth}px)</p>
                    <select value={viewportWidth} onChange={event => setViewportWidth(Number(event.currentTarget.value))}>
                        <option value="320">Apple iPhone 4</option>
                        <option value="375">Apple iPhone X</option>
                        <option value="768">Apple iPad Air</option>
                        <option value="1920">Desktop</option>
                        <option value="5120">Retina</option>
                    </select>
                </label>
            </div>}
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
                    usemShots={props.usemShots}
                    viewportWidth={viewportWidth}
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