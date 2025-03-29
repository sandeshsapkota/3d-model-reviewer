import {useCommentContext} from "@/ModelsReviewer/context/CommentContext.tsx";
import cx from "classnames";
import {Comment} from "@/@types";

function CommentItem({comment}: { comment: Comment }) {
    const {handleToggleActive} = useCommentContext()
    return (
        <li onClick={() => {
            handleToggleActive(comment.id)
        }}
            className={cx("p-3 bg-white shadow-sm rounded-md grid gap-2 cursor-pointer border border-transparent transition duration-200", {
                "!border-blue-500": comment.isActive
            })}>
            <div className="flex items-center gap-1">
                <div
                    className="bg-gray-100 w-8 h-8 text-sm flex items-center justify-center rounded-full font-semibold">JD
                </div>
                <p className={"font-bold text-xs"}>John Doe</p>
            </div>
            <p className="text-sm text-gray-700">{comment.comment}</p>
        </li>
    )
}

export default CommentItem;