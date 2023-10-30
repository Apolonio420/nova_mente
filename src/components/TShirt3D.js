import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three';  
import { OrbitControls, Box } from '@react-three/drei';

const SetCameraPosition = () => {
  const { camera } = useThree();
  camera.position.set(0, 0, 20);
  camera.lookAt(0, 0, 0);
  return null;
};

const TShirt3D = ({ images }) => {
  const [model, setModel] = useState(null);
  const controlsRef = useRef();

  useEffect(() => {
    const loader = new GLTFLoader();
    const textureLoader = new TextureLoader();  // Moverlo dentro de useEffect

    loader.load(
      '/shirt_baked.glb',
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child.name === "lambert1") {
            if (images.length > 0) {
              textureLoader.load(images[0].url, (texture) => {
                child.material.map = texture;
                child.material.needsUpdate = true;
              });
            }
          }
        });
        setModel(gltf.scene);
      },
      undefined,
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }, [images]);

  return (
    <div style={{ height: '50vh', width: '100%' }}>
      <Canvas>
        <SetCameraPosition />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        {model ? <primitive object={model} position={[0, 0, 0]} scale={35} /> : null}
        {model ? null : <Box args={[1, 1, 1]} position={[0, 0, 0]}><meshStandardMaterial color={"blue"} /></Box>}
        <OrbitControls ref={controlsRef} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} minDistance={1} maxDistance={50} />
      </Canvas>
    </div>
  );
};

export default TShirt3D;
