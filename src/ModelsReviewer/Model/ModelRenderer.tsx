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

    const {setActiveVertices, isCommentActive, savedComments, utilsRef, activeVertices, comment, setComment, handleSaveComment, handleToggleActive, handleToggleCommentMode, handleDeleteComment } = useCommentContext()

    const { scene } = useGLTF(url);

    useEffect(() => {
        // Clear draft comments when this component mounts (i.e. model changes)
        setActiveVertices({x: null, y: null, z: null});
        
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
        if (vertices.x !== null && vertices.y !== null && vertices.z !== null) {
            const targetPosition = new Vector3(vertices.x, vertices.y, vertices.z);
            
            // Calculate global bounding box & center
            const box = new THREE.Box3().setFromObject(scene);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            // Determine optimal camera distance scale
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = perspCamera.fov * (Math.PI / 180);
            const distanceScale = Math.abs(maxDim / Math.sin(fov / 2) / 1.5);

            // Create a directional vector extending from the center of the object THROUGH the comment point
            const direction = targetPosition.clone().sub(center).normalize();
            
            // Position the camera outside the model along this direction vector
            const optimalCameraPosition = center.clone().add(direction.multiplyScalar(distanceScale * 0.8));
            perspCamera.position.copy(optimalCameraPosition);

            if (controlsRef.current) {
                // FORCE the orbit pivot point to always be the absolute center of the object!
                controlsRef.current.target.copy(center);
                controlsRef.current.update();
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
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 lg:bottom-auto lg:top-1/2 lg:left-full lg:ml-4 lg:translate-x-0 lg:-translate-y-1/2 w-[240px] lg:w-64 p-4 bg-white/95 backdrop-blur-xl border border-zinc-200/80 rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] pointer-events-auto z-50 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-zinc-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">JD</div>
                                                    <span className="text-zinc-900 font-semibold text-sm">John Doe</span>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteComment(savedComment.id);
                                                    }}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Delete comment"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                                                    </svg>
                                                </button>
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
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 lg:bottom-auto lg:top-1/2 lg:left-full lg:ml-4 lg:translate-x-0 lg:-translate-y-1/2 w-[240px] lg:w-72 p-1 bg-white/95 backdrop-blur-xl border border-zinc-200/80 rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] pointer-events-auto z-50 animate-in zoom-in-95 duration-200">
                                <div className="relative flex flex-col">
                                    <textarea
                                        autoFocus
                                        placeholder="Add a comment..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-zinc-800 placeholder:text-zinc-400 text-sm font-medium resize-none min-h-[60px]"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                if (comment.trim()) {
                                                    handleSaveComment(comment);
                                                }
                                            }
                                        }}
                                    />
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
                onDoubleClick={(e: ThreeEvent<MouseEvent>) => {
                    e.stopPropagation();
                    handleToggleCommentMode();
                }}
            />
        </group>
    );
}

export default ModelRenderer;