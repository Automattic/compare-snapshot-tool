import { useCallback, useEffect } from "react";

function Navigation ({ data, currentIndex, setCurrentIndex, popoverOpen }) {
    const handleNextData = useCallback(() => {
        const length = data.length;
        let index = currentIndex + 1;
        index = index % length;
        setCurrentIndex(index);
    }, [setCurrentIndex, currentIndex, data]);
    
    const handlePreviousData = useCallback(() => {
        const length = data.length;
        let index = currentIndex;
        index = index === 0 ? length - 1 : index - 1;
        setCurrentIndex(index);
    }, [setCurrentIndex, currentIndex, data]);

    const handleNextUnverified = useCallback(() => {
        let map = data.map(d => d.status);
        let index = map.indexOf('', currentIndex + 1);
        if (index === -1) {
            index = map.indexOf('');
            // In case nothing was ever found, stay on the currentIndex
            if (index === -1) {
                alert("All items are verified.");
                index = currentIndex;
            }
        }
        setCurrentIndex(index);
    }, [setCurrentIndex, currentIndex, data]);

    const handlePrevUnverified = useCallback(() => {
        let map = data.map(d => d.status);
        let index = map.lastIndexOf('', currentIndex - 1);
        if (index === -1) {
            index = map.lastIndexOf('');
            // In case nothing was ever found, stay on the currentIndex
            if (index === -1) {
                alert("All items are verified.");
                index = currentIndex;
            }
        }
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