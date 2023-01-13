export default function Navigation(props) {
    return (
        <div className="navigation">
          <button onClick={props.onPrev}>{'\u2B05'} Previous</button>
          <button onClick={props.onClose}>Close</button>
          <button onClick={props.onNext}>Next {'\u27A1'}</button>    
        </div>
    );
}