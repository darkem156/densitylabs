import { useEffect, useReducer, useState } from "react"
import CommentComponent, { Comment } from './Comment'
import commentReducer, { emptyComment } from "../utils/commentReducer"

const API_URL = 'http://localhost:3000'

export default function Comments() {
  const [comments, setComments] = useState(new Array<Comment>)
  const [state, dispatch] = useReducer(commentReducer, {comment: "", email: "", id: -1, fatherComment: emptyComment})
  const { comment, email, id, fatherComment } = state

  useEffect(() => {
    getComments()
  }, [])

  async function createComment() {
    const response = await fetch(`${API_URL}/comments/newcomment`, {
      method: 'POST',
      body: JSON.stringify({comment, email, fatherComment: fatherComment.id}),
      headers: {
          'Content-Type': 'application/json'
      }
    })
    if(response.status !== 200) {
      alert('Bad Request')
      return
    }
    dispatch({ type: "clear" })
    getComments()
  }

  async function getComments() {
    const response = await fetch(`${API_URL}/comments`)
    const data = await response.json()
    const allComments = new Map<number, Comment>()
    data.map((comment: Comment) => {
      if(comment.fatherCommentId) {
        const father = allComments.get(comment.fatherCommentId)
        father?.children.push(comment)
        if(father) allComments.set(comment.fatherCommentId, father)
      }
      else allComments.set(comment.id, {...comment, children: []})
    })
    const commentsArray: Comment[] = []
    allComments.forEach((comment: Comment) => commentsArray.push(comment))
    setComments(commentsArray)
  }

  async function editComment() {
    const response = await fetch(`${API_URL}/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({comment}),
      headers: {
          'Content-Type': 'application/json'
      }
    })
    if(response.status !== 200) {
      alert('Bad Request')
      return
    }
    dispatch({ type: "clear" })
    getComments()
  }

  const commentParams = {
    getComments,
    commentDispatch: dispatch
  }

  return (
    <div style={
      {
        border: '2px solid #0000004d',
        padding: '10px'
      }
    }>
      <div>
        <h2>Leave comments</h2>
        <div className="comment-wrapper">
          {id == -1 ? <></> : <div>
              <p>Editing commentary</p>
              <button onClick={() => dispatch({ type: "clear" })}>x</button>
            </div>}
          {fatherComment.id == -1 ? <></> : <div>
            <div>
              <p>Answering to: <b>{fatherComment.email}</b></p>
              <p>{fatherComment.comment}</p>
            </div>
              <button onClick={() => dispatch({ type: "setFather", payload: emptyComment }) }>x</button>
            </div>}
          <input value={email} onChange={(e) => dispatch({ type: "setEmail", payload: e.target.value })} type="email" placeholder="Email" />
          <textarea value={comment} onChange={(e) => dispatch({ type: "setComment", payload: e.target.value })} placeholder="Add a comment ..." />
        </div>
        <button onClick={() => id == -1 || fatherComment.id != -1 ? createComment() : editComment() }>Comment</button>
      </div>
      <div style={
        {
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '50vw',
          minWidth: '290px',
          gap: '10px',
        }
      }>
        {comments.length > 0 ? comments.map((comment: Comment) => (
          <CommentComponent key={comment.id} {...commentParams} data={comment}>
            <>
              { comment.children.map((answer: Comment) => 
                <CommentComponent key={answer.id} {...commentParams} data={{...answer, fatherComment: comment}} />
              ) }
            </>
          </CommentComponent>)
          ) : <p>No comments</p>}
      </div>
    </div>
  )
}