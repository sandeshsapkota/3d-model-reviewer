import {createContext, RefObject, useContext} from "react";
import {Comment, Vertex} from "@/@types";

export interface UtilsRefType {
    handleRotateCamera?: (vertices: Vertex) => void;
}
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

export const CommentContext = createContext<CommentContextType | null>(null);

const useCommentContext = () => {
    const context = useContext(CommentContext);
    if (!context) {
        throw new Error("useCommentContext must be used within a CommentProvider");
    }
    return context;
};

export default useCommentContext;