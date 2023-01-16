const Data = (props) => {
    const data = props.data;
    const getTotalPassed = () => {
      return data.filter((item) => item.status === "PASSED").length;
    }
  
    const getTotalFailed = () => {
      return data.filter((item) => item.status === "FAILED").length;
    }
  
    const getRemaining = () => {
      return data.filter((item) => !item.status).length;
    }
    return(
      <div className='csv-data'>
        <p>{props.data.length} pages total</p>
        <p>{getTotalPassed()} passed, {getTotalFailed()} failed</p>
        <p>{getRemaining()} pages left to verify</p>
      </div>
     )
  }

function FileUpload(props) {
    return (
        <div className='file-upload'>
            <p className='instructions-message'>Prepare your CSV file with the following columns: </p>
            <p><code>oldUrl</code>, <code>newUrl</code>, <code>status</code>, and <code>comment</code></p>
            <div className='input-file'>
                <input id="actual-button" type="file" name="file" onChange={props.onHandleChange} accept=".csv" hidden/>
                <label id='actual-button-label' htmlFor="actual-button">Choose File</label>
                <span id="file-chosen">{props.fileName}</span>
                { props.dataIsSet ? (
                    <Data data={props.data}/>
                ) : null }
            </div>
        </div>
    )
}

export default FileUpload;