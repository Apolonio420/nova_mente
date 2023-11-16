import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader, ShaderMaterial, Color, MeshBasicMaterial, SphereGeometry, Mesh } from 'three';
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

  // Carga la textura de espacio
  const spaceTexture = new TextureLoader().load('/background2.png');

  // Crea un material con la textura de espacio
  const spaceMaterial = new MeshBasicMaterial({
    map: spaceTexture,
    side: THREE.BackSide,
  });

  // Crea una geometría de esfera
  const spaceGeometry = new SphereGeometry(500, 32, 32);

  // Crea un mesh con la geometría y el material
  const spaceMesh = new Mesh(spaceGeometry, spaceMaterial);

  useEffect(() => {
    // Define una imagen predeterminada para usar en caso de que no haya imágenes disponibles
    const defaultImage = '/dog1.png';
    // Si hay imágenes disponibles, usa la URL de la primera imagen, de lo contrario usa la imagen predeterminada
    const imageToLoad = (Array.isArray(images) && images.length > 0) ? images[0].url : defaultImage;
  
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    const textureLoader = new THREE.TextureLoader();
  
    // Carga la textura de la imagen
    textureLoader.load(imageToLoad, (texture) => {
      console.log('Imagen cargada con éxito:', imageToLoad);
      console.log('Texture Object:', texture);
      
      texture.premultiplyAlpha = true;
    
      const myCustomMaterial = new ShaderMaterial({
        uniforms: {
          myTexture: { value: texture },
          originalTexture: { value: new THREE.TextureLoader().load('/tshirt/map/AFT0001A_diffuse_1001.png') },
          backgroundColor: { value: new Color('gray') },
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
    varying vec2 vUv;
    void main() {
      vec2 center = vec2(0.251153, 0.335014);
      vec2 diff = vUv - center;
      vec4 originalColor = texture2D(originalTexture, vUv);
      vec4 customTexture = texture2D(myTexture, (vUv - center) * 5.0 + 0.5);
      if (abs(diff.x) < 0.1 && abs(diff.y) < 0.1) {
        gl_FragColor = mix(originalColor, customTexture, customTexture.a);
      } else {
        gl_FragColor = originalColor;
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

  }, (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  }, (error) => {
    console.error('Error al cargar la imagen:', imageToLoad, error);
  });

}, [images]);

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <Canvas>
        <SetCameraPosition />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <primitive object={spaceMesh} />
        {model ? <primitive object={model} /> : null}
        <OrbitControls ref={controlsRef} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} minDistance={1} maxDistance={100} />
      </Canvas>
    </div>
  );
};

export default TShirt3D;
