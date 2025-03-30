import {FaCaretRight, FaCaretLeft} from "react-icons/fa";
import {useFullScreen} from '@/ModelsReviewer/context/FullScreen/useFullScreen.tsx';

const SidebarExpander = () => {
    const {isFullScreen, toggleFullScreen} = useFullScreen()
    return (
        <button
            onClick={toggleFullScreen}
            className="absolute top-[50%]  -left-5 w-5 h-14 flex items-center justify-center border-none rounded-l bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors">
            {
                isFullScreen ? <FaCaretLeft size={16} className="ml-1"/> : <FaCaretRight size={16} className="ml-1"/>
            }
        </button>
    )
}
export default SidebarExpander