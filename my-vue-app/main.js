import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Function to generate Cayley's permutation graph for a group
const generateCayleysPermutationGraph = (order, generators, xOffset) => {
    const group = new THREE.Group();

    const elements = Array.from({ length: order }, (_, i) => i);

    const nodes = elements.map(element => {
        const sphereGeometry = new THREE.SphereGeometry(0.2);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        const theta = (2 * Math.PI * element) / order; // Regular spacing for permutation elements
        sphere.position.set(xOffset + Math.cos(theta), Math.sin(theta), 0);
        group.add(sphere);
        return sphere;
    });

    const edgesGroup = new THREE.Group();

    elements.forEach(element => {
        generators.forEach(gen => {
            const targetElement = (element + gen) % order; // Permutation composition: (element + gen) % order
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([nodes[element].position, nodes[targetElement].position]);
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            edgesGroup.add(line);
        });
    });

    return { group, edgesGroup };
};

// Function to generate Cayley's cyclic graph for a group
const generateCayleysCyclicGraph = (order, generator, xOffset) => {
    const group = new THREE.Group();

    const elements = Array.from({ length: order }, (_, i) => i);

    const nodes = elements.map(element => {
        const sphereGeometry = new THREE.SphereGeometry(0.2);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        const theta = (2 * Math.PI * element) / order; // Regular spacing for cyclic elements
        sphere.position.set(xOffset + Math.cos(theta), Math.sin(theta), 0);
        group.add(sphere);
        return sphere;
    });

    const edgesGroup = new THREE.Group();

    elements.forEach(element => {
        const targetElement = (element + generator) % order; // Cyclic composition: (element + generator) % order
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([nodes[element].position, nodes[targetElement].position]);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        edgesGroup.add(line);
    });

    return { group, edgesGroup };
};

// Set up common scene, camera, renderer, and controls
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

// Example: Generate and visualize Cayley's permutation graph with a specific order and generating set
const orderPermutation = 10; // Set your desired permutation group order
const generatingSetPermutation = [1, 5]; // Set your desired generating set for permutation
const permutationGraph = generateCayleysPermutationGraph(orderPermutation, generatingSetPermutation, 0);

// Example: Generate and visualize Cayley's cyclic graph with a specific order and generator
const orderCyclic = 10; // Set your desired cyclic group order
const generatorCyclic = 6; // Set your desired generator for cyclic
const cyclicGraph = generateCayleysCyclicGraph(orderCyclic, generatorCyclic, 3);

// Add permutation and cyclic graph elements to the common scene
scene.add(permutationGraph.group);
scene.add(permutationGraph.edgesGroup);
scene.add(cyclicGraph.group);
scene.add(cyclicGraph.edgesGroup);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Render function
const render = () => {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
};

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initial render
render();
