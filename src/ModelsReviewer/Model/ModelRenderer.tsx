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

    const {setActiveVertices, isCommentActive, savedComments, utilsRef } = useCommentContext()

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
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, perspCamera);
            const intersects = raycaster.intersectObjects(scene.children);
            if (intersects.length > 0) {
                setActiveVertices(intersects[0].point)
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
                savedComments.map((comment: Comment) => {
                    return (
                        <group
                            key={comment.id}
                            position={[
                                comment.vertices.x as number,
                                comment.vertices.y as number,
                                comment.vertices.z as number + 0.01
                            ]}
                        >
                            <Html center zIndexRange={[100, 0]}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${comment?.isActive ? 'bg-indigo-600 scale-125 ring-4 ring-indigo-500/30' : 'bg-white/90 backdrop-blur-md border-2 border-indigo-500 hover:scale-110 group cursor-pointer'}`}
                                     style={{ pointerEvents: 'none' }}>
                                    <div className={`w-2.5 h-2.5 rounded-full ${comment?.isActive ? 'bg-white' : 'bg-indigo-500 group-hover:bg-indigo-600 transition-colors'}`} />
                                </div>
                            </Html>
                        </group>
                    );
                })
            }
            <primitive 
                object={scene} 
                scale={[1, 1, 1]} 
                onClick={handleClick}
            />
        </group>
    );
}

export default ModelRenderer;