export default function Download(props) {
    return (
        <div className="download">
          <button className="download" onClick={ props.onDownload } value="download">Download</button>
        </div>
    )
}