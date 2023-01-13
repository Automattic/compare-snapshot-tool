import { useState } from "react";

export default function Popup(props) {
    const [comment, setComment] = useState(props.value);
    const handleSubmit = (event) => {
        event.preventDefault();
        if ( !comment ) {
            setComment(props.value);
        }
        props.onReject(comment);
        props.closePopup();
    }

    const handleOnChange = (event) => {
        setComment(event.target.value);
    }

    return (
        <div className="popup-container">
            <div className="popup-body">
                <h2>Comment for rejecting</h2>
                <form>
                    <textarea 
                        id="comment-field" 
                        rows="10" 
                        cols="100" 
                        onChange={handleOnChange}
                        defaultValue={props.value}
                    ></textarea>
                </form>
                <div className="popup-actions">
                    <button className="accept" onClick={handleSubmit}>Save</button>    
                    <button className="reject" onClick={props.closePopup}>Cancel</button>
                </div>
            </div>
        </div>
    )
}