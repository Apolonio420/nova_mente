import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'three';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const SetCameraPosition = () => {
  const { camera } = useThree();
  camera.position.set(0, 0, 50);
  camera.lookAt(0, 0, 0);
  return null;
};

const TShirt3D = ({ images }) => {
  const [model, setModel] = useState(null);
  const controlsRef = useRef();

  useEffect(() => {
    const defaultImage = '/dog1.png'; // Imagen predeterminada
    const imageToLoad = images.length > 0 ? images[0] : defaultImage;
  
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    const textureLoader = new THREE.TextureLoader();
  
    // Cargar el mapa de opacidad
    const opacityMap = textureLoader.load('/tshirt/map/AFT0001A_opacity_1001.png');
  
    mtlLoader.load('/tshirt/AFT0001A.mtl', (materials) => {
      materials.preload();
      objLoader.setMaterials(materials);
      objLoader.load('/tshirt/AFT0001A.obj', (obj) => {
        obj.traverse((child) => {
          if (child.isMesh) {
            const mainTexture = textureLoader.load(imageToLoad);
            const normalMap = textureLoader.load('/tshirt/normal_map.png');
            const displacementMap = textureLoader.load('/tshirt/displacement_map.png');
  
            // Aplicar el mapa de opacidad y configurar la transparencia
            child.material[0].opacityMap = opacityMap;
            child.material[0].transparent = false;
  
            child.material[0].map = mainTexture;
            child.material[0].normalMap = normalMap;
            child.material[0].displacementMap = displacementMap;
  
            child.material[0].needsUpdate = true;
          }
        });
        obj.scale.set(0.5, 0.5, 0.5);
        obj.position.set(0, -45, 0);
        setModel(obj);
      });
    });
  }, [images]);
  
  
  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <Canvas>
        <SetCameraPosition />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        {model ? <primitive object={model} /> : null}
        <OrbitControls ref={controlsRef} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} minDistance={1} maxDistance={100} />
      </Canvas>
    </div>
  );
};

export default TShirt3D;
