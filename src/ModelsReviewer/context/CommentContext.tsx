import {createContext, ReactNode, useContext, useRef, useState, RefObject} from "react";
import styles from "@/test.module.scss";
import CommentSidebar from "@/ModelsReviewer/ModelSidebar/ModelSidebar.tsx";

interface CommentContextType {
    comment: string;
    isCommentActive: boolean;
    savedComments: Comment[];
    activeVertices: Vertex;
    handleToggleCommentMode: () => void;
    handleSaveComment: (comment: string) => void;
    setComment: (comment: string) => void;
    handleToggleActive: (id: number) => void
    utilsRef: RefObject<UtilsRefType>
    setSavedComments: (comments: Comment[]) => void
    setIsCommentActive: (active: boolean) => void
    setActiveVertices: (vertices: Vertex) => void
}

const CommentContext = createContext<CommentContextType | null>(null);

import {Comment, Vertex} from "@/@types";

import cx from "classnames";
import {useFullScreen} from "@/ModelsReviewer/context/FullScreenContext.tsx";
import CommentButton from "@/ModelsReviewer/ModelSidebar/CommentButton.tsx";
import NextPrev from "@/ModelsReviewer/context/NextPrev.tsx";

interface UtilsRefType {
    handleRotateCamera?: (vertices: Vertex) => void;
}

export const CommentProvider = ({children}: { children: ReactNode }) => {
    const utilsRef = useRef<UtilsRefType>({});
    const [comment, setComment] = useState<string>("");
    const [isCommentActive, setIsCommentActive] = useState(false);
    const [savedComments, setSavedComments] = useState<Comment[]>([]);
    const [activeVertices, setActiveVertices] = useState<Vertex>({x: null, y: null, z: null});
    const {isFullScreen} = useFullScreen()

    const handleToggleCommentMode = () => {
        setIsCommentActive(!isCommentActive);
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
                    <NextPrev/>
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
