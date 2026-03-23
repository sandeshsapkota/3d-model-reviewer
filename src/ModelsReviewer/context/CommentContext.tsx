import { ReactNode, useRef, useState } from "react";
import CommentSidebar from "@/ModelsReviewer/ModelSidebar/ModelSidebar.tsx";
import SidebarExpander from "@/ModelsReviewer/ModelSidebar/SidebarExpander.tsx";
import { Comment, Vertex } from "@/@types";

import { useFullScreen } from "@/ModelsReviewer/context/FullScreen/FullScreenContext.tsx";
import CommentButton from "@/ModelsReviewer/ModelSidebar/CommentButton.tsx";
import NextPrev from "@/ModelsReviewer/context/NextPrev.tsx";
import { CommentContext, UtilsRefType } from "@/ModelsReviewer/context/useCommentContext.tsx";

export const CommentProvider = ({ children }: { children: ReactNode }) => {
    const utilsRef = useRef<UtilsRefType>({});
    const [comment, setComment] = useState<string>("");
    const [isCommentActive, setIsCommentActive] = useState(false);
    const [savedComments, setSavedComments] = useState<Comment[]>([]);
    const [activeVertices, setActiveVertices] = useState<Vertex>({ x: null, y: null, z: null });
    const { isFullScreen } = useFullScreen()

    const handleToggleCommentMode = () => {
        setIsCommentActive(!isCommentActive);
    };

    const handleSaveComment = (comment: string) => {
        if (comment.trim() && activeVertices.x !== null) {
            setSavedComments([...savedComments.map(item => ({ ...item, isActive: false })), {
                comment,
                isActive: true,
                id: Date.now(),
                vertices: activeVertices
            }]);
            setComment("");
            setActiveVertices({ x: null, y: null, z: null });
        }
    };

    const handleToggleActive = (id: number) => {
        const updatedComments = savedComments.map((comment) => {
            return comment.id === id ? { ...comment, isActive: true } : { ...comment, isActive: false };
        });
        const item = updatedComments.find(item => item.id === id);
        setSavedComments(updatedComments);
        setActiveVertices({ x: null, y: null, z: null }); // Close any draft comment

        if (item?.vertices) {
            utilsRef?.current?.handleRotateCamera?.(item.vertices);
        }
    };

    return (
        <div className="flex w-full h-screen overflow-hidden bg-zinc-100 font-sans">
            <CommentContext.Provider value={{
                comment,
                setComment,
                savedComments,
                setSavedComments,
                isCommentActive,
                setIsCommentActive,
                activeVertices,
                setActiveVertices,
                handleSaveComment,
                handleToggleCommentMode,
                handleToggleActive,
                utilsRef,
            }}>
                {/* Main 3D Area */}
                <div className="flex-1 relative h-full overflow-hidden z-20 bg-zinc-900 transition-all duration-500">
                    {/* Floating Instruction Banner */}
                    {isCommentActive && savedComments.length === 0 && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 px-5 py-3 bg-white/95 backdrop-blur-md text-zinc-700 border border-zinc-200/50 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></div>
                            <span className="font-medium tracking-wide text-[14px]">Click anywhere on the 3D model to leave a comment</span>
                        </div>
                    )}
                    <CommentButton />
                    <NextPrev />
                    {children}
                </div>

                {/* Sliding right sidebar wrapper */}
                <div className={`relative h-full transition-[min-width,width] duration-500 ease-in-out z-30 ${isFullScreen ? 'min-w-0 w-0' : 'min-w-[400px] w-[400px]'}`}>

                    {/* The Toggle Button hangs perfectly on the left edge of this sliding wrapper */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 z-50">
                        <SidebarExpander />
                    </div>

                    {/* Sidebar Content slides smoothly off-screen to the right */}
                    <div className="absolute top-0 right-0 h-full w-[400px] overflow-hidden shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.05)] border-l border-zinc-200/60 transition-transform duration-500 bg-white"
                        style={{ transform: isFullScreen ? 'translateX(100%)' : 'translateX(0)' }}>
                        <CommentSidebar />
                    </div>
                </div>
            </CommentContext.Provider>
        </div>
    );
};


