// anime({
//     targets: '.box',      
//     translateX: 250,  
//     translateY:250,
//     duration: 1000,         
//     // loop:true,
//     direction:'forward',
//     easing: 'easeInOutQuad'
//   });



// const tl = anime.timeline({
//     easing: 'easeOutExpo',
//     duration: 750
// });
// tl
//     .add({ targets: '.box', translateX: 250 })
//     .add({ targets: '.box', rotate: 360 })
//     .add({ targets: '.box', scale: 1.5 });


// document.querySelector(".box").addEventListener('click', () => {
//     const tl = anime.timeline({
//         duration: 750
//     });
//     tl
//         .add({
//             targets: '.box',
//             translateY: 100,
//             easing: 'easeOutBounce'
//         })
//         .add({
//             targets: '.box',
//             translateY: 0,
//         });

// })


// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), alpha: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(window.devicePixelRatio);

// const light = new THREE.PointLight(0xffffff, 1);
// light.position.set(10, 10, 10);
// scene.add(light);

// camera.position.z = 5;

// let model;

// const mtlLoader = new THREE.MTLLoader();
// mtlLoader.setPath('./'); // where .mtl is
// mtlLoader.load('camera.mtl', (materials) => {
//   materials.preload();

//   const objLoader = new THREE.OBJLoader();
//   objLoader.setMaterials(materials);
//   objLoader.setPath('./'); // where .obj is
//   objLoader.load('camera.obj', (object) => {
//     model = object;
//     object.scale.set(0.2, 0.2, 0.2);
//     object.position.y = -1;
//     scene.add(object);
//   });
// });

// window.addEventListener('scroll', () => {
//   const t = window.scrollY;
//   if (model) {
//     model.rotation.y = t * 0.0015;
//     model.rotation.x = t * 0.001;
//   }
// });

// function animate() {
//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);
// }

// animate();












const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

camera.position.z = 5;

let model;
let particles;

// Create particle system
function createParticles() {
  const particleCount = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  // Define color palette for aesthetic particles
  const colorPalette = [
    new THREE.Color(0.8, 0.9, 1.0),    // Light blue
    new THREE.Color(1.0, 0.8, 0.9),    // Light pink
    new THREE.Color(0.9, 0.9, 1.0),    // Lavender
    new THREE.Color(1.0, 0.9, 0.8),    // Warm white
    new THREE.Color(0.8, 1.0, 0.9),    // Light mint
  ];
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Random positions in a large sphere
    positions[i3] = (Math.random() - 0.5) * 50;
    positions[i3 + 1] = (Math.random() - 0.5) * 50;
    positions[i3 + 2] = (Math.random() - 0.5) * 50;
    
    // Random colors from palette
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
    
    // Random sizes
    sizes[i] = Math.random() * 3 + 1;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  // Create custom shader material for particles
  const vertexShader = `
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  
  const fragmentShader = `
    varying vec3 vColor;
    
    void main() {
      float distance = length(gl_PointCoord - vec2(0.5));
      float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
      
      // Create soft glow effect
      float glow = 1.0 - smoothstep(0.0, 0.3, distance);
      alpha = alpha * 0.8 + glow * 0.2;
      
      gl_FragColor = vec4(vColor, alpha * 0.6);
    }
  `;
  
  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true
  });
  
  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

// Initialize particles
createParticles();

// Load 3D model
const mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('./'); // where .mtl is
mtlLoader.load('camera.mtl', (materials) => {
  materials.preload();

  const objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath('./'); // where .obj is
  objLoader.load('camera.obj', (object) => {
    model = object;
    object.scale.set(0.2, 0.2, 0.2);
    object.position.y = -1;
    scene.add(object);
  });
});

// Enhanced scroll interaction
window.addEventListener('scroll', () => {
  const t = window.scrollY;
  
  if (model) {
    model.rotation.y = t * 0.0015;
    model.rotation.x = t * 0.001;
  }
  
  // Animate particles based on scroll
  if (particles) {
    particles.rotation.y = t * 0.0005;
    particles.rotation.x = t * 0.0003;
  }
});

// Animation loop with particle effects
function animate() {
  requestAnimationFrame(animate);
  
  const time = Date.now() * 0.001;
  
  // Animate particles
  if (particles) {
    // Gentle rotation
    particles.rotation.y += 0.002;
    
    // Floating motion
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(time + positions[i] * 0.01) * 0.005;
    }
    particles.geometry.attributes.position.needsUpdate = true;
  }
  
  // Gentle camera sway
  camera.position.x = Math.sin(time * 0.5) * 0.1;
  camera.position.y = Math.cos(time * 0.3) * 0.05;
  camera.lookAt(scene.position);
  
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});