import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Function to generate Cayley's graph for a group
const generateCayleysGraph = (groupElements, generator) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;
  controls.maxPolarAngle = Math.PI / 2;

  const verticesGroup = new THREE.Group();
  scene.add(verticesGroup);

  const elements = groupElements;

  const vertices = elements.map(element => {
    const vertex = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    const theta = Math.random() * 2 * Math.PI; // Randomize vertex position
    vertex.position.set(Math.cos(theta), Math.sin(theta), 0);
    verticesGroup.add(vertex);
    return vertex;
  });

  const edgesGroup = new THREE.Group();
  scene.add(edgesGroup);

  elements.forEach(element => {
    const targetElement = (element * generator) % elements.length;
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([vertices[element].position, vertices[targetElement].position]);
    const line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: 0xffffff }));
    edgesGroup.add(line);
  });

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  const render = () => {
    renderer.render(scene, camera);
  };

  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    render();
  };

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
  });

  animate();
};

// Example: Generate and visualize Cayley's graph with a random group and generator
const randomGroup = Array.from({ length: 10 }, (_, i) => i); // Replace with your desired group size
const randomGenerator = Math.floor(Math.random() * randomGroup.length);
generateCayleysGraph(randomGroup, randomGenerator);
