import useCommentContext from "@/ModelsReviewer/context/useCommentContext.tsx";
import cx from "classnames";
import { Comment } from "@/@types";

function CommentItem({ comment }: { comment: Comment }) {
    const { handleToggleActive } = useCommentContext()
    return (
        <li onClick={() => {
            handleToggleActive(comment.id)
        }}
            className={cx("p-3 bg-white rounded-lg shadow-sm border border-zinc-200/60 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-indigo-300 hover:-translate-y-0.5 group", {
                "!border-indigo-500 bg-indigo-50/20 shadow-md": comment.isActive
            })}>
            <div className="flex items-center gap-2.5 mb-2">
                <div
                    className="bg-gradient-to-br from-indigo-100 to-blue-50 w-7 h-7 text-indigo-700 flex items-center justify-center rounded-full text-xs font-bold shadow-sm border border-indigo-100 group-hover:scale-105 transition-transform duration-300">
                    JD
                </div>
                <div>
                    <p className="font-semibold text-zinc-900 leading-tight text-[13px]">John Doe</p>
                    <p className="text-[11px] text-zinc-400 font-medium">Just now</p>
                </div>
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed px-1">{comment.comment}</p>
        </li>
    )
}

export default CommentItem;