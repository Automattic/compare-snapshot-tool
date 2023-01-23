const Comment = ({commentTitle, comment}) => {
    return (
        <div>
          <b>{commentTitle}</b>
          <p>{comment}</p>
        </div>
    )
}

export default Comment;