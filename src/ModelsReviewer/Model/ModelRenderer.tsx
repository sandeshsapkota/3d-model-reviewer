import * as THREE from "three";
import {useLoader} from "@react-three/fiber";
import {Object3D, Object3DEventMap, TextureLoader, Vector3} from "three";
// @ts-ignore
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {OrbitControls} from "@react-three/drei";
import {useCommentContext} from "../context/CommentContext.tsx";
import {useThree} from "@react-three/fiber";
import {useEffect, useRef} from "react";
import {Comment} from "@/@types"

function ModelRenderer({url, textureUrl}: {
    url: string,
    textureUrl: string | string[],
}) {
    const {camera} = useThree()
    const controlsRef = useRef(null)

    const {setActiveVertices, isCommentActive, savedComments, utilsRef} = useCommentContext()

    const texture = useLoader(TextureLoader, textureUrl);
    const obj = useLoader(OBJLoader, url);

    obj.traverse((child: Object3D<Object3DEventMap>) => {
        if (child?.isMesh) {
            child.material.map = texture;
        }
    });


    const handleClick = (event: any) => {
        if (isCommentActive) {
            /*
            * finding out vertices of the clicked object
                * */
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, event.camera);
            const intersects = raycaster.intersectObjects(obj.children);
            setActiveVertices(intersects[0].point)
        }
    };

    const handleRotateCamera = ({x, y, z}: { x: number, y: number, z: number }) => {
        const targetPosition = new Vector3(x, y, z)
        camera.position.set(targetPosition.x + 5, targetPosition.y + 5, targetPosition.z + 5)

        if (controlsRef.current) {
            controlsRef.current.target.copy(targetPosition)
            controlsRef.current.update()
        }
    }

    useEffect(() => {
        if (utilsRef?.current) {
            utilsRef.current.handleRotateCamera = handleRotateCamera
        }
    }, [])


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
            <primitive object={obj} scale={[0.1, 0.1, 0.1]} onClick={handleClick}/>
        </group>
    );
}

export default ModelRenderer;