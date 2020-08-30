import React from 'react'
import CommentContext from '../../contexts/CommentContext'
import { useContext } from 'react'
const unescapeHtml = (unsafe) => {
  if (!unsafe) {
    return null;
  }
  return unsafe
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, "\"")
      .replace(/&#039;/g, "'");
}

const Comments = ({comments}) => { 
  const commentList = comments.data[1].data.children.map(comment => {
    return (
      <div className="comment-box" key={comment.data.id}>
        <div className="comment-header">
          <h3>{comment.data.author}</h3>
        </div>
        <div className="comment-body">
          <p dangerouslySetInnerHTML={{__html: unescapeHtml(comment.data.body_html)}}></p>
        </div>
      </div>
    )
})
return commentList;
}
const CommentBox = () => {
  const commentData = useContext(CommentContext);
  return (
    <div className="comment-box-container">
      <h2>Comments</h2>
      <div className="comment-list">
        {commentData.data ? (
          <Comments comments={commentData} />
        ) : null
        }
      </div>
    </div>
  )
}

export default CommentBox;