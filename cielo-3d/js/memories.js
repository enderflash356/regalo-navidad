const objectsToFind = [
    // 2 Adentro de la cabaña
    { country: 'huacho', inside: true, pos: new THREE.Vector3(-2.5, 1.01, -21.5), title: "🇵🇪 El Refugio del Café", desc: "Incluso en los días pesados, saber que estabas al otro lado del chat convertía cualquier tarde gris en un rincón cálido.", img: "../gifs/tu-imagen-o-gif-1.gif", activated: false },
    { country: 'guatemala', inside: true, pos: new THREE.Vector3(2.5, 1.01, -21.5), title: "🇬🇹 Mixco y las 18:32", desc: "El instante exacto en que el crepúsculo cubría Guatemala y el cielo atestiguaba nuestra conexión silenciosa.", img: "../gifs/tu-imagen-o-gif-2.gif", activated: false },
    
    // 2 En el Bosque Exterior
    { country: 'huacho', inside: false, pos: new THREE.Vector3(-25, 0, -32), title: "💬 El Comienzo en Discord", desc: "Entre roles, moderación y casualidades de la vida, terminamos cruzando nuestros caminos.", img: "../gifs/tu-imagen-o-gif-3.gif", activated: false },
    { country: 'guatemala', inside: false, pos: new THREE.Vector3(28, 0, 25), title: "💖 La Promesa del 11", desc: "Dejar los miedos atrás y elegirnos todos los días, construyendo este puente entre Perú y Guatemala.", img: "../gifs/tu-imagen-o-gif-4.gif", activated: false }
];

let foundCount = 0;
const interactBtn = document.getElementById('interact-btn');
let currentCountry = 'huacho';

function initMemories(scene) {
    const objectsGroup = new THREE.Group();
    objectsToFind.forEach((obj, idx) => {
        const altarGroup = new THREE.Group();
        
        // Base de piedra abajo
        const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.8), new THREE.MeshBasicMaterial({ color: 0x1e293b }));
        baseMesh.position.y = 0.25;
        
        // Cristal azul flotando arriba de la base
        const relicMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.4), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
        relicMesh.position.y = 0.9; 
        relicMesh.userData = { objIdx: idx };
        
        altarGroup.add(baseMesh, relicMesh);
        altarGroup.position.copy(obj.pos);
        
        objectsGroup.add(altarGroup);
        obj.mesh = altarGroup;
        obj.relic = relicMesh;
        
        if(obj.country !== currentCountry) {
            altarGroup.visible = false;
        }
    });
    scene.add(objectsGroup);
}

function updateCountryVisibility() {
    objectsToFind.forEach(obj => {
        if(obj.mesh) {
            const matchesLocation = (obj.inside === insideCabin);
            obj.mesh.visible = (obj.country === currentCountry && matchesLocation);
        }
    });
}

function checkProximity(camera) {
    let nearAny = false;
    const cabinZ = camera.position.z - (-20);
    const distDoor = Math.hypot(camera.position.x - 0, cabinZ - 4.8);
    
    if (distDoor < 3.5) {
        nearAny = true;
        if(interactBtn) {
            interactBtn.textContent = insideCabin ? "🚪 Salir" : "🚪 Entrar";
            interactBtn.classList.add('active');
        }
    }

    objectsToFind.forEach(obj => {
        const matchesLocation = (obj.inside === insideCabin);
        if (obj.country === currentCountry && matchesLocation && !obj.activated) {
            const dist = camera.position.distanceTo(obj.pos);
            if (dist < 3.5) {
                nearAny = true;
                if(interactBtn) {
                    interactBtn.textContent = "✨ Abrir";
                    interactBtn.classList.add('active');
                }
            }
        }
    });

    if (!nearAny && interactBtn) interactBtn.classList.remove('active');
    updateCountryVisibility();
}

function triggerInteraction() {
    const cabinZ = camera.position.z - (-20);
    const distDoor = Math.hypot(camera.position.x - 0, cabinZ - 4.8);

    if (distDoor < 3.5) {
        insideCabin = !insideCabin;
        camera.position.set(0, 1.8, insideCabin ? -18.5 : -13);
        updateCountryVisibility();
        return;
    }

    objectsToFind.forEach(obj => {
        const matchesLocation = (obj.inside === insideCabin);
        if (obj.country === currentCountry && matchesLocation && !obj.activated) {
            const dist = camera.position.distanceTo(obj.pos);
            if (dist < 3.5) {
                obj.activated = true;
                foundCount++;
                
                if(obj.relic) obj.relic.visible = false;
                
                const textureLoader = new THREE.TextureLoader();
                textureLoader.load(obj.img, (texture) => {
                    const planeMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
                    const floatingPic = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.9), planeMat);
                    
                    // Altura base inicial para que flote elegante
                    floatingPic.position.set(0, 1.4, 0);
                    
                    // Activamos billboard y animación de flotación
                    floatingPic.userData = { isBillboard: true, isFloating: true, basePosY: 1.4 };
                    obj.mesh.add(floatingPic);
                }, undefined, () => {
                    const fallbackMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.9), new THREE.MeshBasicMaterial({ color: 0xffffff }));
                    fallbackMesh.position.set(0, 1.4, 0);
                    fallbackMesh.userData = { isBillboard: true, isFloating: true, basePosY: 1.4 };
                    obj.mesh.add(fallbackMesh);
                });

                document.getElementById('score-val').textContent = foundCount;
                
                if (foundCount === 4) {
                    showStarModal("🎉 ¡TODOS LOS RECUERDOS ENCONTRADOS!", "¡Increíble! Has unificado los dos mundos y encontrado las piezas de nuestra historia. Tu contraseña secreta es:\n\n🔑 **'13-JUL-2026-0931'**\n\nMándasela por Discord o chat para reclamar la última parte de tu regalo 💖");
                } else {
                    showStarModal(obj.title, obj.desc);
                }
                if(interactBtn) interactBtn.classList.remove('active');
            }
        }
    });
}

if(interactBtn) interactBtn.addEventListener('click', triggerInteraction);

function toggleLocation() {
    const btn = document.getElementById('loc-btn');
    if (currentCountry === 'huacho') {
        currentCountry = 'guatemala'; 
        btn.innerHTML = '🇬🇹 Guatemala';
    } else {
        currentCountry = 'huacho'; 
        btn.innerHTML = '🇵🇪 Huacho';
    }
    updateCountryVisibility();
}

function showStarModal(title, desc) { 
    document.getElementById('modal-star-title').textContent = title;
    document.getElementById('modal-star-desc').innerHTML = `<p>${desc.replace(/\n/g, '<br>')}</p>`; 
    document.getElementById('star-modal').classList.add('active'); 
}

function closeStarModal() { 
    document.getElementById('modal-star-desc').innerHTML = '...';
    document.getElementById('star-modal').classList.remove('active'); 
}