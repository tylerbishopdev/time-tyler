"use client";
/// <reference types="@react-three/fiber" />
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            primitive: any;
            ambientLight: any;
            directionalLight: any;
            group: any;
        }
    }
}

const Primitive: any = "primitive";
const AmbientLight: any = "ambientLight";
const DirectionalLight: any = "directionalLight";
const Group: any = "group";

function FramedCharacter() {
    const { camera } = useThree();
    const groupRef = React.useRef<any>(null);
    const gltf = useGLTF("/models/character.glb");

    React.useEffect(() => {
        if (!groupRef.current || !gltf?.scene) return;

        // Reset transforms before measuring
        groupRef.current.scale.set(1, 1, 1);
        groupRef.current.position.set(0, 0, 0);

        const bbox = new Box3().setFromObject(groupRef.current);
        const size = bbox.getSize(new Vector3());
        const center = bbox.getCenter(new Vector3());

        // Center model at origin so OrbitControls target [0,0,0] frames it properly
        groupRef.current.position.x -= center.x;
        groupRef.current.position.y -= center.y;
        groupRef.current.position.z -= center.z;

        // Compute scale so the model height fills ~90% of viewport height at current camera distance
        let visibleHeight = 1;
        const camAny: any = camera as any;
        if (camAny.isPerspectiveCamera) {
            const distance = camera.position.length();
            visibleHeight = 2 * distance * Math.tan(((camAny.fov as number) * Math.PI) / 360);
        } else if (camAny.isOrthographicCamera) {
            visibleHeight = Math.abs((camAny.top as number) - (camAny.bottom as number));
        }
        const desired = visibleHeight * 0.95;
        const scale = size.y > 0 ? desired / size.y : 1;
        groupRef.current.scale.setScalar(scale);

        // Ensure the model's front faces the camera by default
        // Rotate 180° from previous adjustment (now -90° yaw)
        groupRef.current.rotation.y = -Math.PI / 2;
        // Tilt the character slightly upward
        groupRef.current.rotation.x = -Math.PI / 12;
    }, [camera, gltf]);

    return (
        <Group ref={groupRef} dispose={null}>
            <Primitive object={gltf.scene} />
        </Group>
    );
}

useGLTF.preload("/models/character.glb");

export function ModelViewer() {
    return (
        <div className="w-full h-full object-fill bg-[url('/bgty7.png')] bg-cover bg-center opacity-70 ">
            <Canvas camera={{ position: [0, 1.2, 3], fov: 45 }} shadows>
                <AmbientLight intensity={0.5} />
                <DirectionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
                <Environment preset="city" />
                <FramedCharacter />
                <ContactShadows position={[0, -1.05, 0]} opacity={0.5} scale={10} blur={2.5} far={10} />
                <OrbitControls enablePan={false} maxPolarAngle={Math.PI * 0.55} target={[0, 0, 0]} />
            </Canvas>
        </div>
    );
}

export default ModelViewer;


