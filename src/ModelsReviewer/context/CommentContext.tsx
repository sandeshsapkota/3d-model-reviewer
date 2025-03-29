import {createContext, ReactNode, useContext, useState} from "react";
import styles from "../../test.module.scss";
import CommentSidebar from "../ModelSidebar/ModelSidebar.tsx";

const CommentContext = createContext<any>(null);

import {Comment, Vertex} from "../ModelSidebar/CommentItem.tsx";

export const CommentProvider = ({children}: { children: ReactNode }) => {
    const [comment, setComment] = useState<string>("");
    const [isCommentActive, setIsCommentActive] = useState(false);
    const [savedComments, setSavedComments] = useState<Comment[]>([]);
    const [activeVertices, setActiveVertices] = useState<Vertex>({x: 0, y: 0, z: 0});

    const handleToggleCommentMode = () => setIsCommentActive(!isCommentActive);

    const handleSaveComment = (comment: string) => {
        if (comment.trim()) {
            setSavedComments([...savedComments, {
                comment,
                id: Date.now(),
                vertices: {...activeVertices}
            }]);
            setComment("");
        }
    };

    return (
        <div className={styles.container}>
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
                handleToggleCommentMode
            }}>
                <div className={styles.modelArea}>
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
