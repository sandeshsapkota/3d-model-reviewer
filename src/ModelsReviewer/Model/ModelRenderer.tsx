import * as THREE from "three";
import {useLoader} from "@react-three/fiber";
import {Object3D, Object3DEventMap, TextureLoader} from "three";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {OrbitControls} from "@react-three/drei";
import {useCommentContext} from "../context/CommentContext.tsx";
import { FaCommentAlt } from "react-icons/fa";
import { Html } from "@react-three/drei";

function ModelRenderer({url, textureUrl}: {
    url: string,
    textureUrl: string,
}) {
    const {setActiveVertices, isCommentActive, savedComments, activeVertices} = useCommentContext()

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


    return <group>
        <OrbitControls zoomSpeed={.5}/>
        {
            savedComments.map((comment) => {
                const {x, y, z} = comment;
                const scaledPosition = new THREE.Vector3(
                    comment.vertices.x * 0.1,
                    comment.vertices.y * 0.1,
                    comment.vertices.z * 0.1
                );
                return (
                    <mesh
                        key={comment.id}
                        position={scaledPosition}
                    >
                        <planeGeometry args={[0.5, 0.5]} />
                        <meshBasicMaterial color="blue" side={THREE.DoubleSide} />
                    </mesh>
                )
            })
        }
        <primitive object={obj} scale={[0.1, 0.1, 0.1]} onClick={handleClick}/>
    </group>;
}

export default ModelRenderer;