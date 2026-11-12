function buildAstronomy(scene, interactiveGroup) {
    // Campo de estrellas en la bóveda celeste
    const starsCount = 3500;
    const starsGeo = new THREE.BufferGeometry(); 
    const starsPos = new Float32Array(starsCount * 3);
    for(let i = 0; i < starsCount * 3; i += 3) { 
        starsPos[i] = (Math.random() - 0.5) * 500; 
        starsPos[i+1] = Math.random() * 250 + 25; 
        starsPos[i+2] = (Math.random() - 0.5) * 500; 
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ size: 1.8, color: 0xbae6fd, transparent: true, opacity: 0.85 })));

    // La Luna Creciente (11 Oct 2026 • 18:32)
    const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    moonMesh.position.set(-50, 25, -120);
    moonMesh.userData = { title: "🌙 Luna del 11 de Oct • 18:32", desc: "Fina luna creciente (fase inicial con poca iluminación) poniéndose por el oeste tras el atardecer." };

    // Planeta Venus en el horizonte oeste
    const venusMesh = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffedd5 }));
    venusMesh.position.set(-40, 28, -110);
    venusMesh.userData = { title: "✨ Planeta Venus", desc: "Brillando en conjunción aparente junto a la luna en el horizonte oeste al caer la tarde." };
    
    interactiveGroup.add(moonMesh, venusMesh);
}