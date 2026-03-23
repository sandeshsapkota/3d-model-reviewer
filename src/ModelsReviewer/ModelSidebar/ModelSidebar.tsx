import {useState} from "react"
import CommentItem from "./CommentItem.tsx";
import {Comment} from "@/@types";
import {isNumber} from "lodash"
import SidebarExpander from "./SidebarExpander.tsx";
import useCommentContext from "@/ModelsReviewer/context/useCommentContext.tsx";

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
        <div className="flex-1 flex flex-col h-full border-l border-zinc-200/60 bg-white/80 backdrop-blur-md relative shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.05)] z-10">
            <div className="p-6 border-b border-zinc-100 bg-white/90">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 tracking-tight">Comments</h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 space-y-4 scrollbar-thin scrollbar-thumb-zinc-200">
                {savedComments?.length > 0 ? (
                    <ul className="space-y-4">
                        {savedComments.map((comment: Comment) => (
                            <CommentItem key={comment.id} comment={comment}/>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400 p-8 text-center animate-in fade-in duration-500">
                        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-zinc-400"
                            >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </div>
                        <p className="text-lg font-medium text-zinc-500 mb-1">No comments yet</p>
                        <p className="text-sm text-zinc-400 mb-4 max-w-[200px]">Click the add comment button to tag the 3D model.</p>
                        {!isCommentActive && (
                            <button onClick={handleToggleCommentMode}
                                    className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-full hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 active:scale-95">
                                Enable Comment Mode
                            </button>
                        )}
                    </div>
                )}
            </div>

            {isCommentActive && hasActiveVertices && (
                <div className="p-6 border-t border-zinc-100 bg-white/90 glass shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)]">
                    <div className="flex relative">
                        <input
                            type="text"
                            placeholder="Add your comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner pr-24"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    saveComment()
                                }
                            }}
                        />
                        <button
                            onClick={saveComment}
                            className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
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