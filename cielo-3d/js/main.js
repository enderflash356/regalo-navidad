const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x03080f, 0.0045);

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.7, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const interactiveGroup = new THREE.Group(); 
scene.add(interactiveGroup);

// Inicializar Módulos
buildEnvironment(scene);
buildAstronomy(scene, interactiveGroup);
initMemories(scene);

// Control de la cámara con el ratón / toque
let isDragging = false, prevMouse = { x: 0, y: 0 }, lon = 0, lat = 10;
container.addEventListener('mousedown', (e) => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY }; });
window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    lon -= (e.clientX - prevMouse.x) * 0.22; lat += (e.clientY - prevMouse.y) * 0.22;
    lat = Math.max(-30, Math.min(75, lat)); prevMouse = { x: e.clientX, y: e.clientY };
});
window.addEventListener('mouseup', () => isDragging = false);

container.addEventListener('touchstart', (e) => {
    if(e.touches.length === 1 && !joyActive) { isDragging = true; prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }
});
window.addEventListener('touchmove', (e) => {
    if (!isDragging || joyActive || e.touches.length !== 1) return;
    lon -= (e.touches[0].clientX - prevMouse.x) * 0.22; lat += (e.touches[0].clientY - prevMouse.y) * 0.22;
    lat = Math.max(-30, Math.min(75, lat)); prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});
window.addEventListener('touchend', () => isDragging = false);

// Raycaster para interactuar con la Luna y Venus haciendo click
const raycaster = new THREE.Raycaster(); 
const mouse = new THREE.Vector2();
window.addEventListener('click', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1; 
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveGroup.children);
    if (intersects.length > 0) {
        const obj = intersects[0].object;
        if(obj.userData && obj.userData.title) showStarModal(obj.userData.title, obj.userData.desc);
    }
});

// Bucle de Animación y Movimiento
function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.003; // Velocidad para la animación de flotar

    scene.traverse((child) => {
        if (child.userData) {
            // Mantener la imagen siempre mirando a la cámara (Billboard)
            if (child.userData.isBillboard) {
                child.lookAt(camera.position);
            }
            // Animación suave de flotación arriba y abajo
            if (child.userData.isFloating) {
                child.position.y = child.userData.basePosY + Math.sin(time) * 0.12;
            }
        }
    });

    let phi = THREE.MathUtils.degToRad(90 - lat);
    let theta = THREE.MathUtils.degToRad(lon);

    const forward = new THREE.Vector3(Math.sin(phi)*Math.sin(theta), 0, Math.sin(phi)*Math.cos(theta)).normalize();
    const side = new THREE.Vector3(Math.sin(theta - Math.PI/2), 0, Math.cos(theta - Math.PI/2)).normalize();

    let nextX = camera.position.x;
    let nextZ = camera.position.z;

    if (moveState.forward !== 0) {
        nextX += forward.x * walkSpeed * moveState.forward;
        nextZ += forward.z * walkSpeed * moveState.forward;
    }
    if (moveState.right !== 0) {
        nextX += side.x * walkSpeed * moveState.right;
        nextZ += side.z * walkSpeed * moveState.right;
    }

    if (!checkCollision(nextX, nextZ)) {
        camera.position.x = nextX;
        camera.position.z = nextZ;
    }

    camera.position.y = 1.7;

    const targetLookAt = new THREE.Vector3(
        camera.position.x + 100 * Math.sin(phi) * Math.sin(theta),
        camera.position.y + 100 * Math.cos(phi),
        camera.position.z + 100 * Math.sin(phi) * Math.cos(theta)
    );
    camera.lookAt(targetLookAt);

    // Rotar los objetos coleccionables de recuerdos
    objectsToFind.forEach(obj => { if(obj.mesh && !obj.activated) obj.mesh.rotation.y += 0.03; });

    checkProximity(camera);
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});