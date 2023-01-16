import generateMShotsUrl from '../lib/mShots';
import { useEffect, useState, useRef } from 'react';

const Title = (props) => {
  return (
    <span>
      <strong>PAGE {props.index}: </strong>
      <a href={props.url} target="_blank" rel="noreferrer">
        {props.url}
      </a>
    </span>
  );
};

const Preview = (props) => {
    // We need a way to force the iframe to remount in the case where mShots isn't ready and has redirected the iframe.
    // Easiest way is the key attribute and bumping it with state!
    // A bit hacky, but probably our best bet given the weird use case.
    const [iframeKey, setIframeKey] = useState(0);
    const [scaleFactor, setScaleFactor] = useState(1);
    const handleReload = () => setIframeKey(iframeKey + 1);
    const containerRef = useRef();
  
    useEffect(() => {
      if(containerRef.current) {
        // scale the iframe to fit the container while simulating the desired viewport width
        setScaleFactor(containerRef.current.getBoundingClientRect().width / props.viewportWidth);
      }
    }, [props.scrollValue, props.viewportWidth]);
  
    return (
      <div className="column">
        <div className="preview-top-bar">
          <Title {...props}></Title>
          <button onClick={handleReload}>Reload</button>
        </div>
        <div
          ref={containerRef}
        >
          <iframe
            key={iframeKey}
            title="preview-0"
            className="preview"
            src={props.mShotsUrl}
            width={props.viewportWidth}
            // use a big value to ensure the iframe is tall enough
            // this way, both iframes will fit on the screen, and will scroll together lock-step by simply scrolling the page itself
            height="10000"
            style={{transform: `scale(${scaleFactor})`}}
          />
        </div>
      </div>
    );
  };

function SitePreview({activeData, oldUrl, usemShots, newUrl, viewportWidth}) {
  let index = activeData + 1;
  
  return (
    <div id="preview-all">
      <Preview
        index={index}
        url={oldUrl}
        mShotsUrl={
          usemShots ? generateMShotsUrl(oldUrl) : oldUrl
        }
        viewportWidth={viewportWidth}
      />
      <Preview
        index={index}
        url={newUrl}
        mShotsUrl={
          usemShots ? generateMShotsUrl(newUrl) : newUrl
        }
        viewportWidth={viewportWidth}
      />
    </div>
  );
}

export default SitePreview;