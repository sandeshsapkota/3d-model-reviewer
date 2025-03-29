import { createContext, ReactNode, useContext } from "react";
import {useLocalStorage} from "react-haiku";
type FullScreenContextType = {
    isFullScreen: boolean;
    toggleFullScreen: () => void;
};

const FullScreenContext = createContext<FullScreenContextType | null>(null);

export const FullScreenProvider = ({ children }: { children: ReactNode }) => {
    const [isFullScreen, setIsFullScreen] = useLocalStorage('fullScreen', false);


    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    return (
        <FullScreenContext.Provider value={{ isFullScreen, toggleFullScreen }}>
            {children}
        </FullScreenContext.Provider>
    );
};

export const useFullScreen = () => {
    const context = useContext(FullScreenContext);
    if (!context) {
        throw new Error("useFullScreen must be used within a FullScreenProvider");
    }
    return context;
};
