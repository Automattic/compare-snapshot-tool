import { useState } from "react";
import { Download, Actions, SitePreview } from "./index.js";
import Papa from "papaparse";

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

    const status = !newData[currentIndex].status ? 'Unverified' : newData[currentIndex].status;

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
                status={status}
            />
            <SitePreview 
                currentIndex={currentIndex}
                currentData={newData[currentIndex]}
                usemShots={props.usemShots}
                viewportWidth={viewportWidth}
                commentTitle={commentTitle}
                status={status}
            />               

        </div>
    );
}

export default Modal;