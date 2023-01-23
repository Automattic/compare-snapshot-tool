import { useCallback, useEffect } from "react";

function Navigation ({ data, currentIndex, setCurrentIndex, popoverOpen }) {
    const handleNextData = useCallback(() => {
        const length = data.length;
        var index = currentIndex + 1;
        index = index % length;
        setCurrentIndex(index);
    }, [setCurrentIndex, currentIndex, data]);
    
    const handlePreviousData = useCallback(() => {
        const length = data.length;
        var index = currentIndex;
        index = index === 0 ? length - 1 : index - 1;
        setCurrentIndex(index);
    }, [setCurrentIndex, currentIndex, data]);

    const handleNextUnverified = useCallback(() => {
        let index = data.findIndex( (currentData, idx) => idx > currentIndex && !currentData.status);
        index = index === -1 ? data.findIndex( (currentData) => !currentData.status) : index;
        setCurrentIndex(index);
    }, [setCurrentIndex, currentIndex, data]);

    const handlePrevUnverified = useCallback(() => {
        let index = data.findLastIndex( (currentData, idx) => idx < currentIndex && !currentData.status);
        index = index === -1 ? data.findLastIndex( (currentData) => !currentData.status) : index;
        setCurrentIndex(index);
    }, [setCurrentIndex, currentIndex, data]);

    useEffect(() => {
        function keyHandler(event) {
            // don't mess with the keyboard when popover is open, the user is typing
            if(!popoverOpen) {
                if(event.key === 'ArrowRight') {
                    handleNextData();
                } else if (event.key === 'ArrowLeft') {
                    handlePreviousData();
                } else if (event.key === 'Escape') {
                    handleNextUnverified();
                }
            }
        }
        window.addEventListener('keyup', keyHandler);
        // scroll up when item is done
        window.scrollTo(0, 0);

        return () => {
            window.removeEventListener('keyup', keyHandler);
        }
    }, [handleNextData, handlePreviousData, handleNextUnverified, popoverOpen])

    return (
        <div className="navigation">
            <button className="skip secondary" onClick={handlePrevUnverified}>&#8617; Last Unverified</button>
            <button className="navigate" onClick={handlePreviousData}>{'<'}</button>
            <p style={{ textAlign: "center"}}>{currentIndex + 1} of {data.length}</p>
            <button className="navigate" onClick={handleNextData}>{'>'}</button>    
            <button className="skip secondary" onClick={handleNextUnverified}>Next Unverified &#8618;</button>
        </div>
    );
}

export default Navigation;