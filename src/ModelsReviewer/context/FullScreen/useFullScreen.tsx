import {  useContext } from "react";
import {FullScreenContext} from "@/ModelsReviewer/context/FullScreen/FullScreenContext.tsx";

export const useFullScreen = () => {
    const context = useContext(FullScreenContext);
    if (!context) {
        throw new Error("useFullScreen must be used within a FullScreenProvider");
    }
    return context;
};
