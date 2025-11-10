import { useRef } from 'react';
import { type CircuitComponent } from '../App';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Component3DProps {
  component: CircuitComponent;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (position: [number, number, number]) => void;
  tool: 'select' | 'wire' | 'delete';
}

export function Component3D({
  component,
  isSelected,
  onSelect,
  onPositionChange,
  tool,
}: Component3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isDragging = useRef(false);
  const { camera, raycaster, pointer, gl } = useThree();

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    if (tool === 'select') {
      isDragging.current = true;
      gl.domElement.style.cursor = 'grabbing';
    }
    onSelect();
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    gl.domElement.style.cursor = 'pointer';
  };

  const handlePointerMove = (e: any) => {
    if (isDragging.current && tool === 'select') {
      e.stopPropagation();

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectPoint);

      if (intersectPoint) {
        onPositionChange([
          Math.round(intersectPoint.x * 2) / 2,
          component.position[1],
          Math.round(intersectPoint.z * 2) / 2,
        ]);
      }
    }
  };

  const getComponentGeometry = () => {
    switch (component.type) {
      case 'resistor':
        return (
          <group>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.15, 0.15, 2, 16]} />
              <meshStandardMaterial color="#D4A574" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
              <meshStandardMaterial color="#888888" metalness={0.8} />
            </mesh>
            {[...Array(4)].map((_, i) => (
              <mesh key={i} position={[0, 0.5 - i * 0.3, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 0.2, 16]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#FF6B6B' : '#4ECDC4'} />
              </mesh>
            ))}
          </group>
        );

      case 'capacitor':
        return (
          <group>
            <mesh position={[-0.15, 0, 0]} castShadow>
              <boxGeometry args={[0.1, 1.5, 1]} />
              <meshStandardMaterial color="#6B8E23" roughness={0.3} />
            </mesh>
            <mesh position={[0.15, 0, 0]} castShadow>
              <boxGeometry args={[0.1, 1.5, 1]} />
              <meshStandardMaterial color="#6B8E23" roughness={0.3} />
            </mesh>
            <mesh position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
              <meshStandardMaterial color="#888888" metalness={0.8} />
            </mesh>
            <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
              <meshStandardMaterial color="#888888" metalness={0.8} />
            </mesh>
          </group>
        );

      case 'led':
        return (
          <group>
            <mesh position={[0, 0.5, 0]} castShadow>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial
                color={component.properties.color || 'red'}
                emissive={component.properties.color || 'red'}
                emissiveIntensity={0.3}
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh position={[0, -0.2, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.4, 0.5, 16]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            <mesh position={[-0.15, -0.8, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
              <meshStandardMaterial color="#888888" metalness={0.8} />
            </mesh>
            <mesh position={[0.15, -0.8, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
              <meshStandardMaterial color="#888888" metalness={0.8} />
            </mesh>
          </group>
        );

      case 'battery':
        return (
          <group>
            <mesh position={[0, 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.5, 0.5, 1.2, 16]} />
              <meshStandardMaterial color="#4A90E2" metalness={0.3} />
            </mesh>
            <mesh position={[0, -0.4, 0]} castShadow>
              <cylinderGeometry args={[0.4, 0.4, 0.4, 16]} />
              <meshStandardMaterial color="#2C5AA0" />
            </mesh>
            <mesh position={[0, 1, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.3, 8]} />
              <meshStandardMaterial color="#FFD700" metalness={0.8} />
            </mesh>
          </group>
        );

      case 'transistor':
        return (
          <group>
            <mesh castShadow>
              <cylinderGeometry args={[0.4, 0.4, 0.8, 16]} />
              <meshStandardMaterial color="#2C3E50" metalness={0.5} />
            </mesh>
            {[-0.5, 0, 0.5].map((x, i) => (
              <mesh key={i} position={[x, -0.5, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
                <meshStandardMaterial color="#888888" metalness={0.8} />
              </mesh>
            ))}
          </group>
        );

      case 'chip':
        return (
          <group>
            <mesh castShadow>
              <boxGeometry args={[2, 0.3, 1.5]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.2} />
            </mesh>
            {[...Array(8)].map((_, i) => (
              <mesh key={`left-${i}`} position={[-1.1, -0.15, -0.6 + i * 0.2]}>
                <boxGeometry args={[0.3, 0.1, 0.1]} />
                <meshStandardMaterial color="#888888" metalness={0.8} />
              </mesh>
            ))}
            {[...Array(8)].map((_, i) => (
              <mesh key={`right-${i}`} position={[1.1, -0.15, -0.6 + i * 0.2]}>
                <boxGeometry args={[0.3, 0.1, 0.1]} />
                <meshStandardMaterial color="#888888" metalness={0.8} />
              </mesh>
            ))}
            <mesh position={[-0.5, 0.16, -0.3]}>
              <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
              <meshStandardMaterial color="#666666" />
            </mesh>
          </group>
        );

      case 'wire':
        return (
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
            <meshStandardMaterial color="#95A5A6" metalness={0.8} />
          </mesh>
        );

      default:
        return (
          <mesh castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
        );
    }
  };

  return (
    <group
      position={component.position}
      rotation={component.rotation}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerOver={() => {
        if (tool === 'select') {
          gl.domElement.style.cursor = 'pointer';
        } else if (tool === 'delete') {
          gl.domElement.style.cursor = 'not-allowed';
        }
      }}
      onPointerOut={() => {
        if (!isDragging.current) {
          gl.domElement.style.cursor = 'default';
        }
      }}
    >
      <mesh ref={meshRef}>{getComponentGeometry()}</mesh>

      {isSelected && (
        <mesh>
          <boxGeometry args={[2.5, 2.5, 2.5]} />
          <meshBasicMaterial
            color="#3B82F6"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
}
