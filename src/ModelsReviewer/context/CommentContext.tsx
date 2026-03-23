import { ReactNode, useEffect, useRef, useState } from "react";
import CommentSidebar from "@/ModelsReviewer/ModelSidebar/ModelSidebar.tsx";
import SidebarExpander from "@/ModelsReviewer/ModelSidebar/SidebarExpander.tsx";
import { Comment, Vertex } from "@/@types";

import { useFullScreen } from "@/ModelsReviewer/context/FullScreen/FullScreenContext.tsx";
import CommentButton from "@/ModelsReviewer/ModelSidebar/CommentButton.tsx";
import NextPrev from "@/ModelsReviewer/context/NextPrev.tsx";
import { CommentContext, UtilsRefType } from "@/ModelsReviewer/context/useCommentContext.tsx";
import { useNavigationContext } from "@/ModelsReviewer/context/NavigationProvider.tsx";

export const CommentProvider = ({ children }: { children: ReactNode }) => {
    const utilsRef = useRef<UtilsRefType>({});
    const [comment, setComment] = useState<string>("");
    const [isCommentActive, setIsCommentActive] = useState(false);
    const [savedComments, setSavedComments] = useState<Comment[]>([]);
    const [activeVertices, setActiveVertices] = useState<Vertex>({ x: null, y: null, z: null });
    const { isFullScreen } = useFullScreen();
    const { activeModel } = useNavigationContext();

    // Per-model comment store: { [modelUrl]: Comment[] }
    // Using a ref so saves don't cause re-renders
    const perModelComments = useRef<Record<string, Comment[]>>({});
    // Track the previous model so we can persist its comments before switching
    const prevModelRef = useRef<string | null>(null);

    // Toast state: appears 1s after each model navigation, adapts to comment count
    const [showToast, setShowToast] = useState(false);
    const [toastDismissed, setToastDismissed] = useState(false);
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Save current model's comments, then restore the new model's comments
    useEffect(() => {
        // 1. Persist comments for the model we're leaving
        if (prevModelRef.current) {
            perModelComments.current[prevModelRef.current] = savedComments;
        }
        prevModelRef.current = activeModel;

        // 2. Restore comments for the model we're entering (or start fresh)
        const restored = activeModel ? (perModelComments.current[activeModel] ?? []) : [];
        setSavedComments(restored);

        // 3. Reset transient UI state
        setComment("");
        setActiveVertices({ x: null, y: null, z: null });
        setIsCommentActive(false);
        setToastDismissed(false);
        setShowToast(false);

        // 4. Re-arm toast for the freshly loaded model
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => {
            setShowToast(true);
        }, 1000);

        return () => {
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeModel]);

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

    const handleDismissToast = () => {
        setShowToast(false);
        setToastDismissed(true);
    };

    return (
        <div className="flex w-full h-screen overflow-hidden bg-grey-100 font-sans">
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
                <div className="flex-1 relative h-full overflow-hidden z-20 bg-gradient-to-b from-zinc-300 via-zinc-400/60 to-zinc-500/80 transition-all duration-500">

                    {/* Hint Toast — bottom-right, delayed, dismissable */}
                    {showToast && !toastDismissed && !isCommentActive && (
                        <div
                            className="absolute bottom-[24px] right-[24px] z-50 flex items-start gap-3 px-5 py-4 rounded-2xl
                                       bg-indigo-600/90 backdrop-blur-xl text-white
                                       shadow-[0_20px_60px_-10px_rgba(99,102,241,0.6)]
                                       border border-indigo-400/30
                                       animate-in fade-in slide-in-from-bottom-4 duration-500
                                       max-w-[300px]"
                        >
                            {/* Icon */}
                            <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                            </div>

                            {/* Text — adapts based on comment count */}
                            <div className="flex-1 min-w-0">
                                {savedComments.length === 0 ? (
                                    <>
                                        <p className="font-semibold text-[13px] leading-snug">Start commenting</p>
                                        <p className="text-indigo-200 text-[12px] mt-0.5 leading-relaxed">
                                            Double-click the model to enable comment mode, then click anywhere to drop a pin.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-semibold text-[13px] leading-snug">
                                            {savedComments.length} comment{savedComments.length > 1 ? 's' : ''} on this model
                                        </p>
                                        <p className="text-indigo-200 text-[12px] mt-0.5 leading-relaxed">
                                            Click a comment in the sidebar to jump to its position.
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Close */}
                            <button
                                onClick={handleDismissToast}
                                className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-indigo-200 hover:text-white hover:bg-white/20 transition-all duration-150"
                                aria-label="Dismiss hint"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Active comment mode banner — pill shape, top-center */}
                    {isCommentActive && (
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50
                                        flex items-center gap-2.5 px-5 py-2.5
                                        bg-indigo-600/85 backdrop-blur-xl text-white
                                        rounded-full shadow-[0_8px_30px_-4px_rgba(99,102,241,0.5)]
                                        border border-indigo-400/30
                                        animate-in fade-in slide-in-from-top-3 duration-400
                                        pointer-events-none select-none">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            <span className="text-[13px] font-medium tracking-wide">
                                Comment mode — click to drop a pin
                            </span>
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


