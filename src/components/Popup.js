import { useState } from "react";

export default function Popup(props) {
    const [comment, setComment] = useState(props.startingComment);
    const handleSave = () => {
		// Fall back to initial comment if they delete the comment
		const commentToSave = comment || props.startingComment;
        props.onSave(commentToSave);
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
                        value={comment}
                        autoFocus
                    ></textarea>
                </form>
                <div className="popup-actions">
                    <button className="accept" onClick={handleSave}>Save</button>    
                    <button className="reject" onClick={props.onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    )
}