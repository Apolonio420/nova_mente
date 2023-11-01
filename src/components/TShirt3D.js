import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader, ShaderMaterial } from 'three';
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
    const defaultImage = '/dog1.png';
    const imageToLoad = images.length > 0 ? images[0] : defaultImage;

    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    const textureLoader = new THREE.TextureLoader();

    const opacityMap = textureLoader.load('/tshirt/map/AFT0001A_opacity_1001.png');

    // Crear ShaderMaterial personalizado
    const myCustomMaterial = new ShaderMaterial({
      uniforms: {
        myTexture: { value: new THREE.TextureLoader().load(imageToLoad) },
        originalTexture: { value: new THREE.TextureLoader().load('/tshirt/map/AFT0001A_diffuse_1001.png') },
        opacityMap: { value: new THREE.TextureLoader().load('/tshirt/map/AFT0001A_opacity_1001.png') },
        // Carga cualquier otro mapa que necesites
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
      uniform sampler2D myTexture;
      uniform sampler2D originalTexture;
      uniform sampler2D opacityMap; // Añadido para el mapa de opacidad
      varying vec2 vUv;
      void main() {
        vec2 center = vec2(0.251153, 0.335014);
        vec2 diff = vUv - center;
        vec4 originalColor = texture2D(originalTexture, vUv);
        vec4 opacityColor = texture2D(opacityMap, vUv); // Añadido para el mapa de opacidad
        if (abs(diff.x) < 0.1 && abs(diff.y) < 0.1) {
          vec4 customTexture = texture2D(myTexture, (vUv - center) * 5.0 + 0.5); // Escalado y centrado
          gl_FragColor = mix(originalColor, customTexture, opacityColor.a); // Utiliza el mapa de opacidad para mezclar
        } else {
          gl_FragColor = mix(originalColor, originalColor, opacityColor.a); // Añadido para utilizar el mapa de opacidad
          }
        }
      `,
    });
    

    mtlLoader.load('/tshirt/AFT0001A.mtl', (materials) => {
      materials.preload();
      objLoader.setMaterials(materials);
      objLoader.load('/tshirt/AFT0001A.obj', (obj) => {
        obj.traverse((child) => {
          if (child.isMesh) {
            child.material = myCustomMaterial;
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

