// Three.js Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Create Grid
const gridHelper = new THREE.GridHelper(200, 50, 0xff71ce, 0x01cdfe);
scene.add(gridHelper);

// Create floating objects
function addStar() {
    const geometry = new THREE.IcosahedronGeometry(Math.random() * 0.5);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x05ffa1,
        wireframe: true
    });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
    return star;
}

const stars = Array(200).fill().map(addStar);

// Lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Main torus
const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff71ce,
    wireframe: true
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torus);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    stars.forEach(star => {
        star.rotation.x += 0.01;
        star.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Progress bar functionality
function updateYearProgress() {
    const now = new Date();
    const start = new Date(2025, 0, 1);
    const end = new Date(2026, 0, 1);
    
    const progress = (now - start) / (end - start) * 100;
    const clampedProgress = Math.max(0, Math.min(100, progress));
    
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-percentage');
    
    progressBar.style.width = `${clampedProgress}%`;
    progressText.textContent = `${clampedProgress.toFixed(2)}%`;
}

// Update progress every second
setInterval(updateYearProgress, 1000);
updateYearProgress();

// Start animation
animate();

// Scroll Animation
document.addEventListener('scroll', () => {
    const t = document.body.getBoundingClientRect().top;
    camera.position.z = 30 + t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
});

// Remove loading overlay after everything is loaded
window.addEventListener('load', () => {
    setTimeout(() => {
        gsap.to('.loading-overlay', {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                document.querySelector('.loading-overlay').style.display = 'none';
            }
        });
    }, 1000);
}); 