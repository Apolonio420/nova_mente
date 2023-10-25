import React, { useEffect, useRef } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three';
import { OrbitControls } from '@react-three/drei';
import sampleImage from '/home/apolonio420/nova_mente/public/dog1.jpg';  // Replace with the path to your sample image

const TShirt3D = ({ image }) => {
  const mesh = useRef(null);
  const { scene } = useThree();
  const gltf = useLoader(GLTFLoader, '/path/to/your/tshirt/model.gltf');  // Replace with the path to your t-shirt 3D model
  const texture = useLoader(TextureLoader, image || sampleImage);  // Load the image as texture

  useEffect(() => {
    if (gltf) {
      // Assuming that the mesh is the first child of the loaded model
      const tshirtMesh = gltf.scene.children[0];
      tshirtMesh.material.map = texture;  // Apply the texture to the t-shirt mesh
      scene.add(gltf.scene);
    }
  }, [gltf, scene, texture]);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <OrbitControls />
    </Canvas>
  );
};

export default TShirt3D;