import useCommentContext from "@/ModelsReviewer/context/useCommentContext.tsx";
import cx from "classnames";
import {Comment} from "@/@types";

function CommentItem({comment}: { comment: Comment }) {
    const {handleToggleActive} = useCommentContext()
    return (
        <li onClick={() => {
            handleToggleActive(comment.id)
        }}
            className={cx("p-5 bg-white rounded-2xl shadow-sm border border-zinc-200/60 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 group", {
                "ring-2 ring-indigo-500 ring-offset-2 border-transparent shadow-md": comment.isActive
            })}>
            <div className="flex items-center gap-3 mb-3">
                <div
                    className="bg-gradient-to-br from-indigo-100 to-blue-50 w-10 h-10 text-indigo-700 flex items-center justify-center rounded-full font-bold shadow-sm border border-indigo-100 group-hover:scale-105 transition-transform duration-300">
                    JD
                </div>
                <div>
                    <p className="font-semibold text-zinc-900 leading-tight">John Doe</p>
                    <p className="text-xs text-zinc-400 font-medium">Just now</p>
                </div>
            </div>
            <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50/50 p-3 rounded-xl border border-zinc-100">{comment.comment}</p>
        </li>
    )
}

export default CommentItem;