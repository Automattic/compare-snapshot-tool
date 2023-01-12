export default function Instructions() {
    return (
        <div className='instructions'>
          <h2>Upload a CSV file to start comparing images</h2>
          <p>This tool will display a side-by-side snapshot of two URLs from CSV.</p>
          <h3>How to use</h3>
          <ol>
            <li>Prepare your CSV file with the following columns: <code>oldUrl</code>, <code>newUrl</code>, <code>status</code>.</li>
            <li>Upload your CSV file.</li>
            <li>You can view the results by clicking on the <b>Previous</b> and <b>Next</b> buttons.</li>
            <li>To add a status or test result, click on <b>Accept</b> button to mark the data as passed. Otherwise, click on the <b>Reject</b> button.</li>
            <li>Once you are done, download the CSV file.</li>
          </ol>
        </div>
      )
}