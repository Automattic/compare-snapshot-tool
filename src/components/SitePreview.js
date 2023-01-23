import generateMShotsUrl from '../lib/mShots';
import { useEffect, useState, useRef } from 'react';
import { Comment } from './index.js';

const Title = (props) => {
  return (
    <div>
        <div>
            <span>
                <strong>{props.title}</strong>
            </span>
            <button className="reload-button" onClick={props.onReload}>Reload</button>
        </div>
        <div>
            <p>
                <a href={props.url} target="_blank" rel="noreferrer">
                    {props.url}
                </a>
            </p>
        </div>
    </div>
    
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
          <Title 
            title={props.title}
            url={props.url}
            onReload={handleReload}
          />
        </div>
        <div
          ref={containerRef}
          // the browser still thinks the iframe is 10000px tall, doesn't recognize the scale transform, so we shrink the div according to the scale factor
          style={{height: 10000 * scaleFactor, overflow: 'hidden'}}
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

function SitePreview({currentIndex, currentData, usemShots, viewportWidth, commentTitle, style}) {
  let index = currentIndex + 1;
  return (
    <div id="preview-all-test" style={style}>
        { currentData.comment && 
          <Comment 
            commentTitle={commentTitle}
            comment={currentData.comment}
          />
        }
        <div id="preview-all">
          <Preview
              title={'Old URL'}
              index={index}
              url={currentData.oldUrl}
              mShotsUrl={
                usemShots ? generateMShotsUrl(currentData.oldUrl) : currentData.oldUrl
              }
              viewportWidth={viewportWidth}
          />
          <Preview
              title={'New URL'}
              index={index}
              url={currentData.newUrl}
              mShotsUrl={
                usemShots ? generateMShotsUrl(currentData.newUrl) : currentData.newUrl
              }
              viewportWidth={viewportWidth}
          />
        </div>
    </div>
  );
}

export default SitePreview;