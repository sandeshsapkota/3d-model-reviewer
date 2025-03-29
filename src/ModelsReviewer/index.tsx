import Model from "./Model/Model.tsx";

/*
* FIND ONE ACTIVE MODELS FROM THE ARRAY AND RENDER ONE
* */
const ModelsReviewer = () => {
    return (
        <div>
            <Model textureUrl={"/cottage_diffuse.png"} url={"/cottage_obj.obj"}/>
        </div>
    );
};

export default ModelsReviewer;