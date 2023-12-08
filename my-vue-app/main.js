import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import SpriteText from 'three-spritetext';

// Function to generate Cayley's permutation graph for a group
const generateCayleysPermutationGraph = (order, generators, xOffset, numPlanes) => {
    const group = new THREE.Group();

    const elements = Array.from({ length: order }, (_, i) => i);

    const radius = 0.1 + 0.5 * Math.sqrt(order);

    // Create an array for z offsets
    const zOffsets = Array.from({ length: order }, (_, i) => (i % numPlanes*0.5));

    const nodes = elements.map(element => {
        const sphereGeometry = new THREE.SphereGeometry(0.1);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        // Use zOffsets array to alternate ahead and behind
        const zOffset = zOffsets[element];

        const theta = (2 * Math.PI * element) / order;
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(xOffset + radius * Math.cos(theta), radius * Math.sin(theta), zOffset);
        group.add(sphere);

        // Label the sphere with a number
        const textSprite = new SpriteText(element.toString());
        textSprite.textHeight = 0.1;
        textSprite.position.set(xOffset + radius * Math.cos(theta), radius * Math.sin(theta), 0.3);
        group.add(textSprite);

        return sphere;
    });

    const edgesGroup = new THREE.Group();

    elements.forEach(element => {
        generators.forEach(gen => {
            const targetElement = (element + gen) % order;
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([nodes[element].position, nodes[targetElement].position]);
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            edgesGroup.add(line);
        });
    });

    return { group, edgesGroup };
};

// Function to generate Cayley's cyclic graph for a group
const generateCayleysCyclicGraph = (order, generator, xOffset, numPlanes) => {
    const group = new THREE.Group();

    const elements = Array.from({ length: order }, (_, i) => i);

    const radius = 0.1 + 0.5 * Math.sqrt(order);

    // Create an array for z offsets
    const zOffsets = Array.from({ length: order }, (_, i) => (i % numPlanes*0.5));

    const nodes = elements.map(element => {
        const sphereGeometry = new THREE.SphereGeometry(0.1);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        // Use zOffsets array to alternate ahead and behind
        const zOffset = zOffsets[element];

        const theta = (2 * Math.PI * element) / order;
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(xOffset + radius * Math.cos(theta), radius * Math.sin(theta), zOffset);
        group.add(sphere);

        // Label the sphere with a number
        const textSprite = new SpriteText(element.toString());
        textSprite.textHeight = 0.1;
        textSprite.position.set(xOffset + radius * Math.cos(theta), radius * Math.sin(theta), 0.3);
        group.add(textSprite);

        return sphere;
    });

    const edgesGroup = new THREE.Group();

    elements.forEach(element => {
        const targetElement = (element + generator) % order;
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([nodes[element].position, nodes[targetElement].position]);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        edgesGroup.add(line);
    });

    return { group, edgesGroup };
};


// Function to generate Hyperbolic Cayley Graph for a group
const generateHyperbolicCayleyGraph = (order, generators, xOffset, numPlanes) => {
    const group = new THREE.Group();

    const elements = Array.from({ length: order }, (_, i) => i);

    const radius = 0.1 + 0.5 * Math.sqrt(order);; // Radius for the Poincaré disk model

    const nodes = elements.map(element => {
        // Convert polar coordinates to Cartesian coordinates in the Poincaré disk model
        const theta = (2 * Math.PI * element) / order;
        const r = radius * Math.sqrt(1 - Math.pow(element / order, 2)); // Hyperbolic radius
        const x = xOffset + r * Math.cos(theta);
        const y = r * Math.sin(theta);

        const sphereGeometry = new THREE.SphereGeometry(0.1);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        // Introduce radial layers based on numPlanes
        const zOffset = (element % numPlanes) * 0.5;

        sphere.position.set(x, y, zOffset);
        group.add(sphere);

        // Label the sphere with a number
        const textSprite = new SpriteText(element.toString());
        textSprite.textHeight = 0.1;
        textSprite.position.set(x, y, 0.3);
        group.add(textSprite);

        return sphere;
    });

    const edgesGroup = new THREE.Group();

    elements.forEach(element => {
        // Ensure generators is treated as an array
        if (!Array.isArray(generators)) {
            generators = [generators];
        }

        generators.forEach(gen => {
            const targetElement = (element + gen) % order;
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([nodes[element].position, nodes[targetElement].position]);
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            edgesGroup.add(line);
        });
    });

    return { group, edgesGroup };
};


// Function to generate Dihedral Cayley Graph for a group
const generateDihedralCayleyGraph = (n, xOffset, numLevels) => {
    const group = new THREE.Group();

    const elements = Array.from({ length: 2 * n }, (_, i) => i);

    const radius = 0.1 + 0.5 * Math.sqrt(2 * n);
    const zOffsets = Array.from({ length: 2 * n }, (_, i) => (i % numLevels));

    const nodes = elements.map(element => {
        const theta = (2 * Math.PI * element) / (2 * n);
        const x = xOffset + radius * Math.cos(theta);
        const y = radius * Math.sin(theta);

        const sphereGeometry = new THREE.SphereGeometry(0.1);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        const zOffset = zOffsets[element];

        sphere.position.set(x, y, zOffset);
        group.add(sphere);

        // Label the sphere with a number
        const textSprite = new SpriteText(element.toString());
        textSprite.textHeight = 0.1;
        textSprite.position.set(x, y, 0.3);
        group.add(textSprite);

        return sphere;
    });

    const edgesGroup = new THREE.Group();

    elements.forEach(element => {
        const targetElement = (element + 1) % (2 * n); // Connect each element to the next one
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

// Dropdown menu for graph selection
// Create the dropdown element
const graphTypeDropdown = document.createElement('select');
graphTypeDropdown.innerHTML = '<option value="permutation">Permutation Graph</option><option value="cyclic">Cyclic Graph</option></option><option value="hyperbolic">Hyperbolic Graph</option><option value="dihedral">Dihedral Graph</option>';
document.body.appendChild(graphTypeDropdown);

// Create the input elements
const orderInput = document.createElement('input');
orderInput.type = 'number';
orderInput.value = '10';
orderInput.min = '1';
orderInput.addEventListener('change', updateGraph);

const generatorInput = document.createElement('input');
generatorInput.type = 'text';
generatorInput.value = '6';
generatorInput.min = '0';
generatorInput.addEventListener('change', updateGraph);

const numPlanesInput = document.createElement('input');
numPlanesInput.type = 'number';
numPlanesInput.value = '1';
numPlanesInput.min = '0';
numPlanesInput.addEventListener('change', updateGraph);

// Append input elements to the body
document.body.appendChild(orderInput);
document.body.appendChild(generatorInput);
document.body.appendChild(numPlanesInput);

// Apply styles to the dropdown and input elements
graphTypeDropdown.style.position = 'fixed';
graphTypeDropdown.style.top = '10px';
graphTypeDropdown.style.left = '10px';
graphTypeDropdown.style.padding = '5px';
graphTypeDropdown.style.borderRadius = '5px';
graphTypeDropdown.style.backgroundColor = '#fff';
graphTypeDropdown.style.border = '1px solid #ccc';

orderInput.style.position = 'fixed';
orderInput.style.top = '50px';
orderInput.style.left = '10px';
orderInput.style.padding = '5px';
orderInput.style.borderRadius = '5px';
orderInput.style.backgroundColor = '#fff';
orderInput.style.border = '1px solid #ccc';

generatorInput.style.position = 'fixed';
generatorInput.style.top = '90px';
generatorInput.style.left = '10px';
generatorInput.style.padding = '5px';
generatorInput.style.borderRadius = '5px';
generatorInput.style.backgroundColor = '#fff';
generatorInput.style.border = '1px solid #ccc';

numPlanesInput.style.position = 'fixed';
numPlanesInput.style.top = '130px';
numPlanesInput.style.left = '10px';
numPlanesInput.style.padding = '5px';
numPlanesInput.style.borderRadius = '5px';
numPlanesInput.style.backgroundColor = '#fff';
numPlanesInput.style.border = '1px solid #ccc';

// Event listener for dropdown change
graphTypeDropdown.addEventListener('change', updateGraph);

// Function to update the graph based on input values
function updateGraph() {
    // Remove existing nodes and edges groups from the scene
    const nodesGroups = scene.children.filter(child => child instanceof THREE.Group);
    nodesGroups.forEach(nodesGroup => {
        scene.remove(nodesGroup);
    });

    const selectedGraphType = graphTypeDropdown.value;

    // Generate and add the selected graph to the scene
    if (selectedGraphType === 'permutation') {
        const orderPermutation = parseInt(orderInput.value, 10);
        const generatorsInputValue = generatorInput.value.trim();
        const generatingSetPermutation = generatorsInputValue ? generatorsInputValue.split(',').map(Number) : [];
        const numPlanesInputValue = parseInt(numPlanesInput.value,10);
        const permutationGraph = generateCayleysPermutationGraph(orderPermutation, generatingSetPermutation, 0, numPlanesInputValue);

        scene.add(permutationGraph.group);
        scene.add(permutationGraph.edgesGroup);
    } else if (selectedGraphType === 'cyclic') {
        const orderCyclic = parseInt(orderInput.value, 10);
        const generatorInputValue = generatorInput.value.trim();
        const generatorCyclic = generatorInputValue ? parseFloat(generatorInputValue) : 0;
        const numPlanesInputValue = parseInt(numPlanesInput.value,10);
        const cyclicGraph = generateCayleysCyclicGraph(orderCyclic, generatorCyclic, 0, numPlanesInputValue);

        scene.add(cyclicGraph.group);
        scene.add(cyclicGraph.edgesGroup);
    } else if (selectedGraphType === 'hyperbolic') {
        const orderHyperbolic = parseInt(orderInput.value, 10);
        const generatorInputValue = generatorInput.value.trim();
        const generatorHyperbolic = generatorInputValue ? parseFloat(generatorInputValue) : 0;
        const numPlanesInputValue = parseInt(numPlanesInput.value,10);
        const hyperbolicGraph = generateHyperbolicCayleyGraph(orderHyperbolic, generatorHyperbolic, 0, numPlanesInputValue);

        scene.add(hyperbolicGraph.group);
        scene.add(hyperbolicGraph.edgesGroup);
    } else if (selectedGraphType === 'dihedral') {
        const orderDihedral = parseInt(orderInput.value, 10);
        const numPlanesInputValue = parseInt(numPlanesInput.value,10);
        const dihedralGraph = generateDihedralCayleyGraph(orderDihedral, 0, numPlanesInputValue);

        scene.add(dihedralGraph.group);
        scene.add(dihedralGraph.edgesGroup);
    }
}

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
