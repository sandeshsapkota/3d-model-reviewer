import {Canvas} from '@react-three/fiber';
import * as THREE from "three";
import {DirectionalLightHelper} from "three";
import {useHelper} from "@react-three/drei";
import {useRef} from "react";
import ModelRenderer from "@/ModelsReviewer/Model/ModelRenderer.tsx";
import {CommentProvider} from "@/ModelsReviewer/context/CommentContext.tsx";
import {useNavigationContext} from "@/ModelsReviewer/context/NavigationProvider.tsx";


function DirectionalLight() {
    const lightRef = useRef<THREE.DirectionalLight>(null!);
    useHelper(lightRef, DirectionalLightHelper, 0.5, "red");
    return (
        <group>
            <directionalLight ref={lightRef} position={[-12, 22, 2]} intensity={2}/>
            <ambientLight intensity={0.5} />
        </group>
    )
}

const Model = () => {
    const {activeModel} = useNavigationContext()

    return (
        <div>
            <CommentProvider>
                <Canvas style={{backgroundColor: "#666"}}>
                    <DirectionalLight/>
                    {activeModel && (
                        <ModelRenderer
                            url={activeModel}
                        />
                    )}
                </Canvas>
            </CommentProvider>
        </div>
    )
}

export default Model;