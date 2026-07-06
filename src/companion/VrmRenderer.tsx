import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRMLoaderPlugin, VRMUtils, VRM } from '@pixiv/three-vrm';
import { CharacterPackage, CompanionState, EmotionData } from './types';

interface VrmRendererProps {
  character: CharacterPackage;
  state?: CompanionState;
}

export function VrmRenderer({ character, state = 'Idle' }: VrmRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const vrmRef = useRef<VRM | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(30.0, 200 / 300, 0.1, 20.0);
    camera.position.set(0.0, 1.4, 1.5); // Adjust for typical character height

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(200, 300);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, Math.PI);
    light.position.set(1.0, 1.0, 1.0).normalize();
    scene.add(light);
    
    // Add ambient light for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // 2. Load VRM
    const loader = new GLTFLoader();
    loader.crossOrigin = 'anonymous';
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      character.modelUrl,
      (gltf) => {
        const vrm = gltf.userData.vrm;
        if (!vrm) return;

        VRMUtils.removeUnnecessaryVertices(gltf.scene);
        VRMUtils.removeUnnecessaryJoints(gltf.scene);

        vrm.scene.rotation.y = Math.PI; // Face the camera
        scene.add(vrm.scene);
        vrmRef.current = vrm;

        // Basic breathing animation setup (we can refine this later)
        // Set up blinking via VRM expression manager in the render loop
      },
      (progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),
      (error) => console.error(error)
    );

    // 3. Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const deltaTime = clock.getDelta();

      if (vrmRef.current) {
        vrmRef.current.update(deltaTime);
        
        // Basic idle breathing
        const time = clock.getElapsedTime();
        const s = Math.sin(Math.PI * time);
        // Subtle chest movement
        if(vrmRef.current.humanoid) {
          const spine = vrmRef.current.humanoid.getNormalizedBoneNode('spine');
          if(spine) {
            spine.rotation.x = 0.05 * s;
          }
        }
      }

      if (mixerRef.current) {
        mixerRef.current.update(deltaTime);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [character.modelUrl]);

  return <div ref={containerRef} style={{ width: '200px', height: '300px' }} />;
}
