import { useState } from "react";
import { Download, Actions, SitePreview } from "./index.js";
import Papa from "papaparse";

const styles = {
    default: {
        backgroundColor: '#f5f5f5',
        border: '1px solid #e3e3e3'
    },
    passed: {
        backgroundColor: '#e6f2e8',
        border: '1px solid #68de86'
    },
    failed: {
        backgroundColor: '#f7ebec',
        border: '1px solid #ffabaf'
    }
} 

const ViewportSelection = (props) => {
    return (
        <div style={{ textAlign: "center"}}>
            <label>
                <p>Viewport width ({props.viewportWidth}px)</p>
                <select value={props.viewportWidth} onChange={event => props.setViewportWidth(Number(event.currentTarget.value))}>
                    <option value="320">Apple iPhone 4</option>
                    <option value="375">Apple iPhone X</option>
                    <option value="768">Apple iPad Air</option>
                    <option value="1920">Desktop</option>
                    <option value="5120">Retina</option>
                </select>
            </label>
        </div>
    )
}

function Modal(props) {
    const [newData, setNewData] = useState([...props.parsedData])
    const [viewportWidth, setViewportWidth] = useState(1920);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [commentTitle, setCommentTitle] = useState('Comment');

    const style = newData[currentIndex].status === 'PASSED' ? styles.passed : newData[currentIndex].status === 'FAILED' ? styles.failed : styles.default;

    const handleDownload = () => {
        const finalData = Papa.unparse(newData);
        const csvContent = `data:text/csv;charset=utf-8,${finalData}`;
        const encodedURI = encodeURI(csvContent);
        window.open(encodedURI);
    }

    return (
        <div id='modal'>
            <h1 style={{ textAlign: "center"}}>Page {currentIndex + 1}</h1>
            { !props.usemShots && 
                <ViewportSelection 
                    viewportWidth={viewportWidth}
                    setViewportWidth={setViewportWidth}
                /> 
            }

            <Download onDownload={handleDownload}/>

            <Actions 
                data={newData}
                setData={setNewData}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                setCommentTitle={setCommentTitle}
                style={style}
            />
            <SitePreview 
                currentIndex={currentIndex}
                currentData={newData[currentIndex]}
                usemShots={props.usemShots}
                viewportWidth={viewportWidth}
                commentTitle={commentTitle}
                style={style}
            />               

        </div>
    );
}

export default Modal;