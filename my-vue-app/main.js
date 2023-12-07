import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Function to generate Cayley's graph for a cyclic group
const generateCayleysGraph = (groupOrder, generator) => {
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

  const elements = Array.from({ length: groupOrder }, (_, i) => i);

  const vertices = elements.map(element => {
    const vertex = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    vertex.position.set(Math.cos((2 * Math.PI * element) / groupOrder), Math.sin((2 * Math.PI * element) / groupOrder), 0);
    verticesGroup.add(vertex);
    return vertex;
  });

  const edgesGroup = new THREE.Group();
  scene.add(edgesGroup);

  elements.forEach(element => {
    const targetElement = (element + generator) % groupOrder;
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

// Call the function to generate and visualize Cayley's graph
generateCayleysGraph(8, 2); // Example with a cyclic group of order 8 and generator 2
