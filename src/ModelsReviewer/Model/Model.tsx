import { Canvas } from '@react-three/fiber';
import * as THREE from "three";
import { DirectionalLightHelper } from "three";
import { useHelper } from "@react-three/drei";
import { useRef, Suspense, useState, useEffect } from "react";
import ModelRenderer from "@/ModelsReviewer/Model/ModelRenderer.tsx";
import { CommentProvider } from "@/ModelsReviewer/context/CommentContext.tsx";
import { useNavigationContext } from "@/ModelsReviewer/context/NavigationProvider.tsx";


function DirectionalLightWithHelper() {
    const lightRef = useRef<THREE.DirectionalLight>(null!);
    useHelper(lightRef, DirectionalLightHelper, 0.5, "red");
    return (
        <group>
            <directionalLight ref={lightRef} position={[-12, 22, 2]} intensity={2} />
            <ambientLight intensity={0.5} />
        </group>
    )
}

function DirectionalLightWithoutHelper() {
    const lightRef = useRef<THREE.DirectionalLight>(null!);
    return (
        <group>
            <directionalLight ref={lightRef} position={[-12, 22, 2]} intensity={2} />
            <ambientLight intensity={0.5} />
        </group>
    )
}

// Simplified fallback as global SceneLoader handles the UI
const LoadingFallback = () => null;

const Model = () => {
    const { activeModel } = useNavigationContext()
    const [isLoading, setIsLoading] = useState(true);

    // Reset loading state when activeModel changes
    useEffect(() => {
        if (activeModel) {
            setIsLoading(true);
            // Set a timeout to hide the helper after model loads
            const timer = setTimeout(() => setIsLoading(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [activeModel]);

    return (
        <div>
            <CommentProvider>
                <Canvas>
                    {isLoading ? <DirectionalLightWithoutHelper /> : <DirectionalLightWithHelper />}
                    {activeModel && (
                        <Suspense fallback={<LoadingFallback />}>
                            <ModelRenderer
                                key={activeModel}
                                url={activeModel}
                            />
                        </Suspense>
                    )}
                </Canvas>
            </CommentProvider>
        </div>
    )
}

export default Model;