import {
  OrbitControls,
  PerspectiveCamera,
  Grid,
  GizmoHelper,
  GizmoViewport,
  Center,
  AccumulativeShadows,
  RandomizedLight,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function DraggableBox({
  position,
  orbitControlsRef,
}: {
  position: [number, number, number];
  orbitControlsRef: React.RefObject<any>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const { camera, gl } = useThree();

  const [isDragging, setIsDragging] = useState(false);
  const [plane] = useState(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const [raycaster] = useState(() => new THREE.Raycaster());
  const [offset] = useState(() => new THREE.Vector3());

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging || !ref.current) return;

      const rect = gl.domElement.getBoundingClientRect();
      const pointer = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      const intersection = new THREE.Vector3();
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(plane, intersection);
      ref.current.position.copy(intersection.sub(offset));
    };

    const handlePointerUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, gl, camera, plane, raycaster, offset, orbitControlsRef]);

  const onPointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;

    const intersection = new THREE.Vector3();
    raycaster.setFromCamera(e.pointer, camera);
    raycaster.ray.intersectPlane(plane, intersection);
    offset.copy(intersection).sub(ref.current!.position);
  };

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerDown={onPointerDown}
      castShadow
    >
      <boxGeometry args={[0.7, 0.7, 0.7]} />
      <meshStandardMaterial color={isDragging ? "orange" : "#9d4b4b"} />
    </mesh>
  );
}

export default function CircuitCanvas() {
  const orbitControlsRef = useRef<any>(null);

  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[15, 15, 15]} fov={50} />
      <OrbitControls
        ref={orbitControlsRef}
        enablePan={true}
        enableZoom={true}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.1}
      />

      {/* Ejemplos */}
      <DraggableBox position={[0, 0, 0]} orbitControlsRef={orbitControlsRef} />
      <DraggableBox position={[3, 0, 0]} orbitControlsRef={orbitControlsRef} />

      <Grid
        cellSize={1}
        cellThickness={0.5}
        cellColor="#ffffff"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#475569"
        fadeDistance={66}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid
      />

      <axesHelper args={[2]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <AccumulativeShadows
        temporal
        frames={100}
        color="#9d4b4b"
        colorBlend={0.5}
        alphaTest={0.9}
        scale={20}
      >
        <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
      </AccumulativeShadows>

      <pointLight position={[-10, -10, -5]} intensity={0.3} />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
          labelColor="white"
        />
      </GizmoHelper>
    </Canvas>
  );
}
