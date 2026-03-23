import {Canvas} from '@react-three/fiber';
import * as THREE from "three";
import {DirectionalLightHelper} from "three";
import {useHelper, Html, useProgress} from "@react-three/drei";
import {useRef, Suspense, useState, useEffect} from "react";
import ModelRenderer from "@/ModelsReviewer/Model/ModelRenderer.tsx";
import {CommentProvider} from "@/ModelsReviewer/context/CommentContext.tsx";
import {useNavigationContext} from "@/ModelsReviewer/context/NavigationProvider.tsx";


function DirectionalLightWithHelper() {
    const lightRef = useRef<THREE.DirectionalLight>(null!);
    useHelper(lightRef, DirectionalLightHelper, 0.5, "red");
    return (
        <group>
            <directionalLight ref={lightRef} position={[-12, 22, 2]} intensity={2}/>
            <ambientLight intensity={0.5} />
        </group>
    )
}

function DirectionalLightWithoutHelper() {
    const lightRef = useRef<THREE.DirectionalLight>(null!);
    return (
        <group>
            <directionalLight ref={lightRef} position={[-12, 22, 2]} intensity={2}/>
            <ambientLight intensity={0.5} />
        </group>
    )
}

// Loading component to show while model is loading
function LoadingFallback() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 w-72">
                <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <div className="text-lg font-bold text-white tracking-widest mb-3 drop-shadow-md">
                    LOADING MODEL
                </div>
                <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden mb-2">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="text-sm font-medium text-white/80 tracking-wider">
                    {Math.round(progress)}%
                </div>
            </div>
        </Html>
    );
}

const Model = () => {
    const {activeModel} = useNavigationContext()
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
                <Canvas style={{backgroundColor: "#1f2937"}}>
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