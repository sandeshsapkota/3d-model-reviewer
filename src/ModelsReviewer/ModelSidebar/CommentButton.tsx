import {useCommentContext} from "@/ModelsReviewer/context/CommentContext.tsx";

const CommentButton = () => {
    const {
        isCommentActive,
        handleToggleCommentMode
    } = useCommentContext()

    return (
        <button
            className={`fixed bottom-4 left-4  z-10 flex items-center justify-center p-2 rounded-full transition-colors ${
                isCommentActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200"
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
    )
}

export default CommentButton;