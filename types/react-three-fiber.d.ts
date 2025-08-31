import type * as THREE from "three";
import type { Object3DNode, ThreeElements } from "@react-three/fiber";

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      primitive: Object3DNode<THREE.Object3D, typeof THREE.Object3D>;
    }
  }
}

export {};
