import LinkedList from "@/utils/linkedList.ts";
import {createContext, useContext, useState, ReactNode} from "react";

type NavigationType = {
    activeModel: string | null;
    nextModel: () => void;
    prevModel: () => void;
};

const NavigationContext = createContext<NavigationType>({
    activeModel: null,
    nextModel: () => {},
    prevModel: () => {},
});

const models = [
    "models/model-1/sample.glb",
    "models/model-2/sample.glb",
    "models/model-3/sample.glb",
];

export const NavigationProvider = ({children}: { children: ReactNode }) => {
    const linkedList = new LinkedList(models);
    const [activeModel, setActiveModel] = useState(linkedList.getCurrent());

    const nextModel = () => {
        linkedList.next();
        setActiveModel(linkedList.getCurrent());
    };

    const prevModel = () => {
        linkedList.prev();
        setActiveModel(linkedList.getCurrent());
    };

    return (
        <NavigationContext.Provider value={{activeModel, nextModel, prevModel}}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigationContext = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error("useNavigationContext must be used within a NavigationProvider");
    }
    return context;
};

