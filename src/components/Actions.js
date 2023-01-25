import { useCallback, useEffect, useState } from 'react';
import { Navigation, Popup } from "./index.js";

export function Actions ({data, setData, currentIndex, setCurrentIndex, setCommentTitle, status}) {
    const [popoverOpen, setPopoverOpen] = useState(false);

    const handleAccept = useCallback(() => {
        let comment = data[currentIndex].comment;
        if ( data[currentIndex].status === 'FAILED' && comment ) {
            setCommentTitle('Comment from Previous Failure');
        }

        setData(prevNewData => prevNewData.map((data, i) => {
          if (i === currentIndex) {
            return {
              ...data,
              status: 'PASSED',
              comment: comment
            }
          }
          return data;
        }));
      }, [currentIndex, data, setData, setCommentTitle]);
    
    const handleReject = useCallback((comment) => {
        setData(prevNewData => prevNewData.map((data, i) => {
            if (i === currentIndex) {
            return {
                ...data,
                status: 'FAILED',
                comment: comment
            }
            }
            return data;
        }));
    }, [currentIndex, setData]);

    useEffect(() => {
        function keyHandler(event) {
            // don't mess with the keyboard when popover is open, the user is typing
            if(!popoverOpen) {
                if (event.key === 'Enter') {
                    handleAccept();
                } else if (event.key === 'Backspace') {
                    setPopoverOpen(true);
                } 
            }
        }
        window.addEventListener('keyup', keyHandler);
        // scroll up when item is done
        window.scrollTo(0, 0);

        return () => {
            window.removeEventListener('keyup', keyHandler);
        }
    }, [currentIndex, handleAccept, popoverOpen])

	const handlePopupSave = useCallback((comment) => {
		handleReject(comment);
		setPopoverOpen(false);
	}, [handleReject, setPopoverOpen]);

	const handlePopupCancel = useCallback(() => {
		setPopoverOpen(false);
	}, [setPopoverOpen])

    return (
        <div className="preview-details">
            <div id="preview-status" className={`status-${status.toLowerCase()}`}>
                <span className="status">{status}</span>
            </div>
            <Navigation
                currentData={data[currentIndex]}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                data={data}
                popoverOpen={popoverOpen}
            />
            <div className="actions">
                <button className="accept" onClick={handleAccept}>Accept ↵</button>
                <button className="reject" onClick={() => setPopoverOpen(true)}>Reject ⌫</button>
                {popoverOpen ? <Popup 
                    onSave={handlePopupSave} 
                    onCancel={handlePopupCancel}
                    startingComment={data.comment}
                /> 
                : null}
            </div>
        </div>
    )
}

export default Actions;