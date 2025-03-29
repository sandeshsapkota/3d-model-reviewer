import {useState} from "react"
import CommentItem from "./CommentItem.tsx";
import {Comment} from "@/@types";
import {useCommentContext} from "../context/CommentContext.tsx";
import {isNumber} from "lodash"
import SidebarExpander from "./SidebarExpander.tsx";

const CommentSidebar = () => {
    const [comment, setComment] = useState("")
    const {
        isCommentActive,
        activeVertices,
        savedComments,
        handleSaveComment,
        handleToggleCommentMode
    } = useCommentContext()


    const saveComment = () => {
        if (comment.trim()) {
            handleSaveComment(comment)
            setComment("")
        }
    }

    const hasActiveVertices = isNumber( activeVertices?.x)


    return (
        <div className="flex-1 flex flex-col h-full border-l border-gray-200 bg-white relative">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Comments</h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
                {savedComments?.length > 0 ? (
                    <ul className="space-y-4">
                        {savedComments.map((comment: Comment) => (
                            <CommentItem key={comment.id} comment={comment}/>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mb-2"
                        >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <p>No comments yet</p>
                        {!isCommentActive && (
                            <button onClick={handleToggleCommentMode}
                                    className="mt-2 text-sm text-blue-600 hover:underline">
                                Enable comment mode to add comments
                            </button>
                        )}
                    </div>
                )}
            </div>

            {isCommentActive && hasActiveVertices && (
                <div className="p-4 border-t border-gray-200">
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Add your comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    saveComment()
                                }
                            }}
                        />
                        <button
                            onClick={saveComment}
                            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            disabled={!comment.trim()}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}

           <SidebarExpander/>
        </div>
    )
}

export default CommentSidebar