import Model from "@/ModelsReviewer/Model/Model.tsx";
import {FullScreenProvider} from "@/ModelsReviewer/context/FullScreenContext";

/*
* FIND ONE ACTIVE MODELS FROM THE ARRAY AND RENDER ONE
* */
const ModelsReviewer = () => {
    return (
        <div>
            <FullScreenProvider>
                <Model textureUrl={"models/cottage/cottage_diffuse.png"} url={"models/cottage/cottage_obj.obj"}/>
            </FullScreenProvider>
        </div>
    );
};

export default ModelsReviewer;
