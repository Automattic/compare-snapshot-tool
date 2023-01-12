export default function Download(props) {
    return (
        <div className="download">
          <button id="download-button" onClick={ props.onDownload } value="download">Download</button>
        </div>
    )
}