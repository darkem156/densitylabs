import { Comment } from "../components/Comment"

export interface ICommentAction {
  type: string
  payload?: Comment | string | number | ICommentState
}

interface ICommentState {
  comment: string
  email: string
  id: number
  fatherComment: Comment
}

export const emptyComment: Comment = {
  comment: "",
  email: "",
  id: -1,
  children: []
}

export default function commentReducer(state: ICommentState, action: ICommentAction) {
  const { type } = action
  switch (type) {
    case "clear": {
      return { comment: "", id: -1, email: "", fatherComment: emptyComment }
    }
    case "setFather": {
      return {...state, fatherComment: action.payload as Comment}
    }
    case "setEmail": {
      return {...state, email: action.payload as string}
    }
    case "setComment": {
      return {...state, comment: action.payload as string}
    }
    case "setState": {
      const { email, comment, id, fatherComment } = action.payload as ICommentState
      return { email, comment, id, fatherComment }
    }
    default:
      return state;
  }
}