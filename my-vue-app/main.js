import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Create a group to hold the vertices
const elements = [0, 1, 2, 3];
const generator = 1;

const verticesGroup = new THREE.Group();
scene.add(verticesGroup);

// Create vertices for each group element
const vertices = elements.map(element => {
  const vertex = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  vertex.position.set(Math.cos((2 * Math.PI * element) / elements.length), Math.sin((2 * Math.PI * element) / elements.length), 0);
  verticesGroup.add(vertex);
  return vertex;
});

// Create edges based on group multiplication with the generator
const edgesGroup = new THREE.Group();
scene.add(edgesGroup);

elements.forEach(element => {
  const targetElement = (element + generator) % elements.length;
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([vertices[element].position, vertices[targetElement].position]);
  const line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: 0xffffff }));
  edgesGroup.add(line);
});

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Render function
const render = () => {
  renderer.render(scene, camera);
};

// Add event listener for window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
});

// Initial render
const animate = () => {
  requestAnimationFrame(animate);

  // Required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  render();
};

// Start the animation loop
animate();
