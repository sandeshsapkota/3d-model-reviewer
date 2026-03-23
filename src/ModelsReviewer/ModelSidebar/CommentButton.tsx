import useCommentContext from "@/ModelsReviewer/context/useCommentContext.tsx";

const CommentButton = () => {
    const {
        isCommentActive,
        handleToggleCommentMode,
        savedComments
    } = useCommentContext()

    return (
        <div className="fixed bottom-6 left-6 z-50 flex items-center">
            <button
                className={`flex items-center justify-center p-3.5 rounded-full transition-all duration-300 shadow-xl cursor-pointer ${
                    isCommentActive ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 ring-4 ring-indigo-500/20" : "bg-white/90 backdrop-blur-md text-zinc-600 hover:bg-white hover:text-indigo-600 border border-zinc-200/60 hover:scale-105"
                }`}
                onClick={handleToggleCommentMode}
                aria-label="Toggle comment mode"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>
            
            {savedComments?.length === 0 && !isCommentActive && (
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-4 w-[200px] text-center bg-zinc-900 text-white text-[14px] leading-[1.4] font-normal px-4 py-3 rounded-xl shadow-xl animate-bounce pointer-events-none before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:-left-1.5 before:w-0 before:h-0 before:border-y-[6px] before:border-y-transparent before:border-r-[8px] before:border-r-zinc-900">
                    Enable comment mode to comment on the 3D model
                </div>
            )}
        </div>
    )
}

export default CommentButton;