import * as THREE from "three";
import {Vector3} from "three";
import {OrbitControls, useGLTF} from "@react-three/drei";
import {useCommentContext} from "../context/CommentContext.tsx";
import {useThree} from "@react-three/fiber";
import {useCallback, useEffect, useRef} from "react";
import {Comment} from "@/@types"
import { ThreeEvent } from '@react-three/fiber'

function ModelRenderer({url}: {
    url: string,
}) {
    const {camera} = useThree()
    const controlsRef = useRef<THREE.OrbitControls>(null)

    const {setActiveVertices, isCommentActive, savedComments, utilsRef } = useCommentContext()

    const { scene } = useGLTF(url)

    const handleClick = (event: ThreeEvent<MouseEvent>) => {
        if (isCommentActive) {
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);
            if (intersects.length > 0) {
                setActiveVertices(intersects[0].point)
            }
        }
    };

    const handleRotateCamera = useCallback( ({x, y, z}: { x: number, y: number, z: number }) => {
        const targetPosition = new Vector3(x, y, z)
        camera.position.set(targetPosition.x + 5, targetPosition.y + 5, targetPosition.z + 5)

        if (controlsRef.current) {
            controlsRef.current?.target?.copy?.(targetPosition)
            controlsRef.current?.update?.()
        }
    }, [])

    useEffect(() => {
        if (utilsRef?.current) {
            utilsRef.current.handleRotateCamera = handleRotateCamera
        }
    }, [utilsRef, handleRotateCamera])


    return (
        <group>
            <OrbitControls zoomSpeed={.5} ref={controlsRef}/>
            {
                savedComments.map((comment: Comment) => {
                    return (
                        <mesh
                            key={comment.id}
                            position={[
                                comment.vertices.x as number,
                                comment.vertices.y as number,
                                comment.vertices.z as number + 0.01
                            ]}
                        >
                            <circleGeometry args={[40 / 1000, 32]}/>
                            <meshBasicMaterial
                                color={comment?.isActive ? "blue" : "orangered"}
                                depthTest={false}
                                transparent={true}
                                opacity={1}
                            />
                        </mesh>
                    );
                })
            }
            <primitive object={scene} scale={[0.1, 0.1, 0.1]} onClick={handleClick}/>
        </group>
    );
}

export default ModelRenderer;