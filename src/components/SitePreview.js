import generateMShotsUrl from "../lib/mShots"

const Title = (props) => {
    return (
        <p>
          <strong>PAGE {props.index}: </strong>
          <a href={props.url} target="_blank" rel="noreferrer">{props.url}</a>
        </p>
    )
}

const Preview = (props) => {
    return (
        <div className="column">
            <Title {...props}></Title>
            <iframe title="preview-0" className="preview" src={props.mShotsUrl} width="100%" height="500" />
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