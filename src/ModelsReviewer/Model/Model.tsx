import {Canvas} from '@react-three/fiber';
import {DirectionalLightHelper} from "three";
import {useHelper} from "@react-three/drei";
import {useRef} from "react";
import ModelRenderer from "@/ModelsReviewer/Model/ModelRenderer.tsx";
import {CommentProvider} from "@/ModelsReviewer/context/CommentContext.tsx";

function DirectionalLight() {
    const lightRef = useRef<any>(null);
    useHelper(lightRef, DirectionalLightHelper, 0.5, "red");
    return <directionalLight ref={lightRef} position={[5, 10, 1]} intensity={2}/>;
}

const Model = ({url, textureUrl}: { url: string; textureUrl: string | string[]}) => {
    return (
        <div>
            <CommentProvider>
                <Canvas style={{backgroundColor: "#666"}}>
                    <DirectionalLight/>
                    <ModelRenderer
                        url={url}
                        textureUrl={textureUrl}
                    />
                </Canvas>
            </CommentProvider>
        </div>
    )
}

export default Model;