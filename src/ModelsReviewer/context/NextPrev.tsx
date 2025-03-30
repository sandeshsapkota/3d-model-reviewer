import {FaCaretLeft, FaCaretRight} from "react-icons/fa";
import {useNavigationContext} from "@/ModelsReviewer/context/NavigationProvider.tsx";

const NextPrev = () => {
    const { nextModel, prevModel } = useNavigationContext()
    return (
        <div className="absolute top-4 right-4 flex gap-1.5 z-10">
            <button
                onClick={prevModel}
                className="w-8 h-8 flex items-center justify-center bg-white border-none rounded  hover:bg-gray-100 cursor-pointer transition-colors">
                <FaCaretLeft size={16}/>
            </button>
            <button
                onClick={nextModel}
                className="w-8 h-8 flex items-center justify-center bg-white border-none rounded  hover:bg-gray-100 cursor-pointer transition-colors">
                <FaCaretRight size={16}/>
            </button>
        </div>
    )
}

export default NextPrev;