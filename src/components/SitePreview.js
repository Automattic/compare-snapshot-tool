import generateMShotsUrl from "../lib/mShots"
import { useState } from "react";

const Title = (props) => {
    return (
        <span>
          <strong>PAGE {props.index}: </strong>
          <a href={props.url} target="_blank" rel="noreferrer">{props.url}</a>
        </span>
    )
}

const Preview = (props) => {
	// We need a way to force the iframe to remount in the case where mShots isn't ready and has redirected the iframe.
	// Easiest way is the key attribute and bumping it with state!
	// A bit hacky, but probably our best bet given the weird use case.
	const [iframeKey, setIframeKey] = useState(0);
	const handleReload = () => setIframeKey(iframeKey + 1);

    return (
        <div className="column">
			<div className="preview-top-bar">
				<Title {...props}></Title>
				<button onClick={handleReload}>Reload</button>
			</div>
            <iframe key={iframeKey} title="preview-0" className="preview" src={props.mShotsUrl} width="100%" height="500" />
        </div>
    )
}

function SitePreview(props) {
    let index = props.activeData + 1;
    return (
        <div id="preview-all">
            <Preview 
                index={index}
                url={props.oldUrl}
                mShotsUrl={generateMShotsUrl(props.oldUrl)}
            />
            <Preview 
                index={index}
                url={props.newUrl}
                mShotsUrl={generateMShotsUrl(props.newUrl)}
            />
        </div>
    )
} 

export default SitePreview;