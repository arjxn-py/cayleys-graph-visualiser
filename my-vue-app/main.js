import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Function to generate Cayley's permutation graph for a group
const generateCayleysPermutationGraph = (order, generators) => {
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

    const group = new THREE.Group();
    scene.add(group);

    const elements = Array.from({ length: order }, (_, i) => i);

    const nodes = elements.map(element => {
        const sphereGeometry = new THREE.SphereGeometry(0.2);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        const theta = (2 * Math.PI * element) / order; // Regular spacing for permutation elements
        sphere.position.set(Math.cos(theta), Math.sin(theta), 0);
        group.add(sphere);
        return sphere;
    });

    const edgesGroup = new THREE.Group();
    scene.add(edgesGroup);

    elements.forEach(element => {
        generators.forEach(gen => {
            const targetElement = (element + gen) % order; // Permutation composition: (element + gen) % order
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([nodes[element].position, nodes[targetElement].position]);
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            edgesGroup.add(line);
        });
    });

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    camera.lookAt(scene.position);

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

// Example: Generate and visualize Cayley's permutation graph with a specific order and generating set
const order = 10; // Set your desired group order
const generatingSet = [1,5]; // Set your desired generating set
generateCayleysPermutationGraph(order, generatingSet);
