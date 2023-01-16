import { useCallback, useEffect, useState } from "react";
import { Download, Navigation, Popup, SitePreview } from "./index.js";
import Papa from "papaparse";

const Actions = ({onReject, onAccept, currentComment, popoverOpen, setPopoverOpen}) => {

	const handlePopupSave = useCallback((comment) => {
		onReject(comment);
		setPopoverOpen(false);
	}, [onReject, setPopoverOpen]);

	const handlePopupCancel = useCallback(() => {
		setPopoverOpen(false);
	}, [setPopoverOpen])

    return (
        <div className="action">
            <button className="accept" onClick={onAccept}>Accept ↵</button>
            <button className="reject" onClick={() => setPopoverOpen(true)}>Reject ⌫</button>
            {popoverOpen ? <Popup 
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
    const [popoverOpen, setPopoverOpen] = useState(false);

    const handleAccept = useCallback(() => {
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
      }, [activeData, newData]);
    
    const handleReject = useCallback((comment) => {
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
    }, [activeData]);

    const handleNextData = useCallback(() => {
        const length = newData.length;
        var index = activeData + 1;
        index = index % length;
        setActiveData(index);
    }, [activeData, newData]);
    
    const handlePreviousData = useCallback(() => {
        const length = newData.length;
        var index = activeData;
        index = index === 0 ? length - 1 : index - 1;
        setActiveData(index);
    }, [activeData, newData]);

    const handleSkip = useCallback(() => {
        let index = newData.findIndex( (data, idx) => idx > activeData && (data.status === '' || data.status === undefined));
        if (index > 0) {
            setActiveData(index);
        }
    }, [activeData, newData]);

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

    useEffect(() => {
        function keyHandler(event) {
            // don't mess with the keyboard is popover is open, the user is typing
            if(!popoverOpen) {
                if (event.key === 'Enter') {
                    handleAccept();
                } else if (event.key === 'Backspace') {
                    setPopoverOpen(true)
                } else if(event.key === 'ArrowRight') {
                    handleNextData();
                } else if (event.key === 'ArrowLeft') {
                    handlePreviousData();
                } else if (event.key === 'Escape') {
                    handleSkip();
                }
            }
        }
        window.addEventListener('keyup', keyHandler);
        // scroll up when item is done
        window.scrollTo(0, 0);

        return () => {
            window.removeEventListener('keyup', keyHandler);
        }
    }, [activeData, handleAccept, handleNextData, handlePreviousData, handleSkip, popoverOpen])

    return (
        <div id='modal'>
            <Skip onSkip={handleSkip}/>
            <Download onDownload={handleDownload}/>
            <Navigation
                onNext={handleNextData}
                onClose={handleModalClose}
                onPrev={handlePreviousData}
            />
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
                        popoverOpen={popoverOpen}
                        setPopoverOpen={setPopoverOpen}
                    />
                </div>
                <SitePreview 
                    activeData={activeData}
                    oldUrl={newData[activeData].oldUrl}
                    newUrl={newData[activeData].newUrl}
                    usemShots={props.usemShots}
                    viewportWidth={viewportWidth}
                />               
            </div>
        </div>
    );
}

export default Modal;