import useCommentContext from "@/ModelsReviewer/context/useCommentContext.tsx";
import cx from "classnames";
import { Comment } from "@/@types";

function CommentItem({ comment }: { comment: Comment }) {
    const { handleToggleActive, handleDeleteComment } = useCommentContext()
    return (
        <li onClick={() => {
            handleToggleActive(comment.id)
        }}
            className={cx("p-3 bg-white rounded-lg shadow-sm border border-zinc-200/60 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-indigo-300 hover:-translate-y-0.5 group", {
                "!border-indigo-500 bg-indigo-50/20 shadow-md": comment.isActive
            })}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                    <div
                        className="bg-gradient-to-br from-indigo-100 to-blue-50 w-7 h-7 text-indigo-700 flex items-center justify-center rounded-full text-xs font-bold shadow-sm border border-indigo-100 group-hover:scale-105 transition-transform duration-300">
                        JD
                    </div>
                    <div>
                        <p className="font-semibold text-zinc-900 leading-tight text-[13px]">John Doe</p>
                        <p className="text-[11px] text-zinc-400 font-medium">Just now</p>
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteComment(comment.id);
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100 duration-200 cursor-pointer"
                    title="Delete comment"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                    </svg>
                </button>
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed px-1">{comment.comment}</p>
        </li>
    )
}

export default CommentItem;