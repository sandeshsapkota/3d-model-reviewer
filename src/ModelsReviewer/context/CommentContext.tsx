import {createContext, ReactNode, useContext, useRef, useState} from "react";
import styles from "@/test.module.scss";
import CommentSidebar from "@/ModelsReviewer/ModelSidebar/ModelSidebar.tsx";

const CommentContext = createContext<any>(null);

import {Comment, Vertex} from "@/@types";

import {FaCaretLeft, FaCaretRight} from "react-icons/fa";
import cx from "classnames";
import {useFullScreen} from "@/ModelsReviewer/context/FullScreenContext.tsx";
import CommentButton from "@/ModelsReviewer/ModelSidebar/CommentButton.tsx";

interface UtilsRefType {
    handleRotateCamera?: (vertices: Vertex) => void;
}

export const CommentProvider = ({children}: { children: ReactNode }) => {
    const utilsRef = useRef<UtilsRefType>({});
    const [comment, setComment] = useState<string>("");
    const [isCommentActive, setIsCommentActive] = useState(false);
    const [savedComments, setSavedComments] = useState<Comment[]>([]);
    const [activeVertices, setActiveVertices] = useState<Vertex>({x: null, y: null, z: null});
    const {isFullScreen, toggleFullScreen} = useFullScreen()

    const handleToggleCommentMode = () => {
        setIsCommentActive(!isCommentActive);
        toggleFullScreen()
    };

    const handleSaveComment = (comment: string) => {
        if (comment.trim()) {
            setSavedComments([...savedComments.map(item => ({...item, isActive: false})), {
                comment,
                isActive: true,
                id: Date.now(),
                vertices: activeVertices
            }]);
            setComment("");
        }
    };

    const handleToggleActive = (id: number) => {
        const updatedComments = savedComments.map((comment) => {
            return comment.id === id ? {...comment, isActive: true} : {...comment, isActive: false};
        });
        const item = updatedComments.find(item => item.id === id);
        setSavedComments(updatedComments);

        if (item?.vertices) {
            utilsRef?.current?.handleRotateCamera?.(item.vertices);
        }
    };

    return (
        <div className={cx(
            styles.container,
            {
                [styles.container__expaned]: isFullScreen
            }
        )}>
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

                <div className={styles.modelArea}>
                    <CommentButton/>
                    <div className="absolute top-4 right-4 flex gap-1.5 z-10">
                        <button
                            className="w-8 h-8 flex items-center justify-center bg-white border-none rounded  hover:bg-gray-100 cursor-pointer transition-colors">
                            <FaCaretLeft size={16}/>
                        </button>
                        <button
                            className="w-8 h-8 flex items-center justify-center bg-white border-none rounded  hover:bg-gray-100 cursor-pointer transition-colors">
                            <FaCaretRight size={16}/>
                        </button>

                    </div>
                    {children}

                </div>
                <CommentSidebar/>
            </CommentContext.Provider>
        </div>
    );
};

export const useCommentContext = () => {
    const context = useContext(CommentContext);
    if (!context) {
        throw new Error("useCommentContext must be used within a CommentProvider");
    }
    return context;
};
