import {FaCaretRight, FaCaretLeft} from "react-icons/fa";
import {useFullScreen} from '@/ModelsReviewer/context/FullScreen/useFullScreen.tsx';

const SidebarExpander = () => {
    const {isFullScreen, toggleFullScreen} = useFullScreen()
    return (
        <button
            onClick={toggleFullScreen}
            className="absolute top-[50%] -translate-y-1/2 -left-6 w-6 h-16 flex items-center justify-center border border-zinc-200/60 border-r-0 rounded-l-xl bg-white/90 backdrop-blur-md hover:bg-white text-zinc-500 hover:text-indigo-600 cursor-pointer transition-all shadow-[-5px_0_15px_-5px_rgba(0,0,0,0.1)] z-20">
            {
                isFullScreen ? <FaCaretLeft size={16} className="ml-1"/> : <FaCaretRight size={16} className="ml-1"/>
            }
        </button>
    )
}
export default SidebarExpander