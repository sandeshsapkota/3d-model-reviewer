import { Comment, Vertex } from "@/@types";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { OrbitControls as OrbitControlsType } from 'three-stdlib';
import useCommentContext from "../context/useCommentContext.tsx";

function ModelRenderer({url}: {
    url: string,
}) {
    const {camera} = useThree()
    const perspCamera = camera as THREE.PerspectiveCamera;
    const controlsRef = useRef<OrbitControlsType>(null)

    const {setActiveVertices, isCommentActive, savedComments, utilsRef, activeVertices, comment, setComment, handleSaveComment, handleToggleActive } = useCommentContext()

    const { scene } = useGLTF(url);

    useEffect(() => {
        // Calculate bounding box
        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Calculate camera distance based on model size
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = perspCamera.fov * (Math.PI / 180);
        const cameraDistance = Math.abs(maxDim / Math.sin(fov / 2) / 1.5);

        // Update camera
        perspCamera.position.set(
            center.x + cameraDistance,
            center.y + cameraDistance,
            center.z + cameraDistance
        );
        perspCamera.far = cameraDistance * 4;
        perspCamera.updateProjectionMatrix();

        // Update controls
        if (controlsRef.current) {
            controlsRef.current.target.copy(center);
            controlsRef.current.minDistance = maxDim / 2;
            controlsRef.current.maxDistance = cameraDistance * 3;
            controlsRef.current.update();
        }
    }, [scene, perspCamera]);

    const handleClick = (event: ThreeEvent<MouseEvent>) => {
        if (isCommentActive) {
            // Prevent placing a new marker if clicking on an HTML element
            if ((event as any).target && ((event as any).target as HTMLElement).closest && ((event as any).target as HTMLElement).closest('.comment-popover')) {
                return;
            }
            
            // R3F handles raycasting natively. We can just use the exact intersection point!
            event.stopPropagation();
            if (event.point) {
                setActiveVertices(event.point);
            }
        }
    };

    const handleRotateCamera = (vertices: Vertex) => {
        if (vertices.x && vertices.y && vertices.z) {
            const targetPosition = new Vector3(vertices.x, vertices.y, vertices.z)
            perspCamera.position.set(targetPosition.x + 5, targetPosition.y + 5, targetPosition.z + 5)

            if (controlsRef.current) {
                controlsRef.current?.target?.copy?.(targetPosition)
                controlsRef.current?.update?.()
            }
        }
    };

    useEffect(() => {
        if (utilsRef?.current) {
            utilsRef.current.handleRotateCamera = handleRotateCamera
        }
    }, [utilsRef, handleRotateCamera])

    return (
        <group>
            <OrbitControls 
                key={url} 
                zoomSpeed={1} 
                ref={controlsRef}
            />
            {
                savedComments.map((savedComment: Comment) => {
                    return (
                        <group
                            key={savedComment.id}
                            position={[
                                savedComment.vertices.x as number,
                                savedComment.vertices.y as number,
                                savedComment.vertices.z as number + 0.01
                            ]}
                        >
                            <Html center zIndexRange={[100, 0]}>
                                <div className="comment-popover relative group">
                                    <div 
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer pointer-events-auto ${savedComment?.isActive ? 'bg-indigo-600 scale-125 ring-4 ring-indigo-500/30' : 'bg-white/90 backdrop-blur-md border-2 border-indigo-500 hover:scale-110'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleActive(savedComment.id);
                                        }}
                                    >
                                        <div className={`w-2.5 h-2.5 rounded-full ${savedComment?.isActive ? 'bg-white' : 'bg-indigo-500 group-hover:bg-indigo-600 transition-colors'}`} />
                                    </div>
                                    
                                    {/* Expanded popover for viewing the comment */}
                                    {savedComment?.isActive && (
                                        <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 w-64 p-4 bg-white/95 backdrop-blur-xl border border-zinc-200/80 rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] pointer-events-auto z-50 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-100">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">JD</div>
                                                <span className="text-zinc-900 font-semibold text-sm">John Doe</span>
                                            </div>
                                            <p className="text-zinc-700 text-sm leading-relaxed">{savedComment.comment}</p>
                                        </div>
                                    )}
                                </div>
                            </Html>
                        </group>
                    );
                })
            }
            {/* Draft Marker Popover */}
            {isCommentActive && activeVertices?.x !== null && (
                <group
                    position={[
                        activeVertices.x as number,
                        activeVertices.y as number,
                        activeVertices.z as number + 0.01
                    ]}
                >
                    <Html center zIndexRange={[100, 0]}>
                        <div className="comment-popover relative">
                            {/* Marker dot */}
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-600 scale-125 ring-4 ring-indigo-500/30 shadow-xl pointer-events-auto">
                                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                            </div>
                            
                            {/* Input Popover */}
                            <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 w-72 p-1 bg-white/95 backdrop-blur-xl border border-zinc-200/80 rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] pointer-events-auto z-50 animate-in zoom-in-95 duration-200">
                                <div className="relative flex">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full px-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-zinc-800 placeholder:text-zinc-400 text-sm font-medium"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && comment.trim()) {
                                                handleSaveComment(comment);
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={() => handleSaveComment(comment)}
                                        disabled={!comment.trim()}
                                        className="m-1 px-4 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Html>
                </group>
            )}
            <primitive 
                object={scene} 
                scale={[1, 1, 1]} 
                onClick={handleClick}
            />
        </group>
    );
}

export default ModelRenderer;