import Model from "@/ModelsReviewer/Model/Model.tsx";
import {FullScreenProvider} from "@/ModelsReviewer/context/FullScreen/FullScreenContext.tsx";
import {NavigationProvider} from "@/ModelsReviewer/context/NavigationProvider.tsx";

/*
* FIND ONE ACTIVE MODELS FROM THE ARRAY AND RENDER ONE
* */
const ModelsReviewer = () => {
    return (
        <div>
            <NavigationProvider>
                <FullScreenProvider>
                    <Model/>
                </FullScreenProvider>
            </NavigationProvider>

        </div>
    );
};

export default ModelsReviewer;
