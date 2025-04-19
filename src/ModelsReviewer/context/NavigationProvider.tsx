import CircularLinkedList from "@/utils/linkedList.ts";
import {createContext, useContext, useState, ReactNode, useMemo} from "react";

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
    "models/model-3/sample.glb",
    "models/model-1/sample.glb",
    "models/model-2/sample.glb",
];

export const NavigationProvider = ({children}: { children: ReactNode }) => {
    // Create LinkedList instance only once
    const linkedList = useMemo(() => new CircularLinkedList(models), []);
    const [activeModel, setActiveModel] = useState<string | null>(linkedList.getCurrent());

    const nextModel = () => {
        const next = linkedList.next();
        if (next) setActiveModel(next);
    };

    const prevModel = () => {
        const prev = linkedList.prev();
        if (prev) setActiveModel(prev);
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
