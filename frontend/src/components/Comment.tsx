import { ReactElement } from "react"
import { emptyComment, ICommentAction } from "../utils/commentReducer"

const API_URL = 'http://localhost:3000'

export interface Comment {
  comment: string
  email: string
  id: number
  fatherComment?: Comment
  fatherCommentId?: number
  children: Comment[]
}

interface CommentParams {
  getComments: () => Promise<void>
  data: Comment
  commentDispatch: React.Dispatch<ICommentAction>
  children?: ReactElement
}

export default function Comment({ getComments, data, commentDispatch, children }: CommentParams) {

  async function deleteComment(id: number) {
    const response = await fetch(`${API_URL}/comments/${id}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      }
    })
    if(response.status !== 200) {
      alert('Bad Request')
      return
    }
    getComments()
  }
  return(
    <div className="comment-card">
      <div style={ { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } }>
        <b style={{ width: '100%', borderBottom: '1px solid #000' }}>{data.email}</b>
        <p style={{ margin: '5px 0 10px' }}>{data.comment}</p>
      </div>
      <div>
        <button onClick={() => {
          commentDispatch({ type: "setState", payload: { comment: data.comment, email: data.email, id: data.id, fatherComment: emptyComment } })
        }}>Edit</button>
        <button onClick={() => deleteComment(data.id)}>Delete</button>
        <button onClick={() => {
          console.log(data)
          commentDispatch({ type: "setFather", payload: data.fatherCommentId == 0 ? data : data.fatherComment })
          }}>Answer</button>
      </div>
      {children}
    </div>
  )
}