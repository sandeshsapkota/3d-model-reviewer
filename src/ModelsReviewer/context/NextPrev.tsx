import {FaCaretLeft, FaCaretRight} from "react-icons/fa";
import {useNavigationContext} from "@/ModelsReviewer/context/NavigationProvider.tsx";

const NextPrev = () => {
    const { nextModel, prevModel } = useNavigationContext()
    return (
        <div className="absolute top-4 right-4 flex gap-1.5 z-10">
            <button
                onClick={prevModel}
                className="w-10 h-10 flex items-center justify-center bg-white border-none rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer transition-colors">
                <FaCaretLeft size={20}/>
            </button>
            <button
                onClick={nextModel}
                className="w-10 h-10 flex items-center justify-center bg-white border-none rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer transition-colors">
                <FaCaretRight size={20}/>
            </button>
        </div>
    )
}

export default NextPrev;