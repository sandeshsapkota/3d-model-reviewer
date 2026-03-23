import CommentItem from "./CommentItem.tsx";
import { Comment } from "@/@types";
import useCommentContext from "@/ModelsReviewer/context/useCommentContext.tsx";

const CommentSidebar = () => {
    const {
        isCommentActive,
        savedComments,
        handleToggleCommentMode
    } = useCommentContext()


    return (
        <div className="flex-1 flex flex-col h-full border-l border-zinc-200/60 bg-white/80 backdrop-blur-md relative shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.05)] z-10">
            <div className="p-5 border-b border-zinc-100 bg-white/90">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 tracking-tight">Comments</h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 space-y-4 scrollbar-thin scrollbar-thumb-zinc-200">
                {savedComments?.length > 0 ? (
                    <ul className="space-y-4">
                        {savedComments.map((comment: Comment) => (
                            <CommentItem key={comment.id} comment={comment} />
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
                        <p className="text-sm text-zinc-500 mb-5 max-w-[240px] leading-relaxed">
                            {isCommentActive 
                                ? "Click anywhere on the 3D model to place a pin and start a discussion." 
                                : "Enable comment mode to place pins and share feedback on the 3D model."}
                        </p>
                        {!isCommentActive && (
                            <button onClick={handleToggleCommentMode}
                                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95">
                                Enable Comment Mode
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentSidebar