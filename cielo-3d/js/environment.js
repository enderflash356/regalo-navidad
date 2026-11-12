function buildEnvironment(scene) {
    // Suelo oscuro del bosque
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshBasicMaterial({ color: 0x061208 }));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // --- CABAÑA ACOGEDORA ESTILO ROBLOX ---
    const cabinGroup = new THREE.Group();
    
    const woodWallMat = new THREE.MeshBasicMaterial({ color: 0x6b4226 }); 
    const woodDarkMat = new THREE.MeshBasicMaterial({ color: 0x3d2110 }); 
    const stoneMat = new THREE.MeshBasicMaterial({ color: 0x2b2b2b });    
    const roofMat = new THREE.MeshBasicMaterial({ color: 0x4a240d });     
    const glassMat = new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.6 }); 

    // 1. Base sólida de piedra
    const stoneBase = new THREE.Mesh(new THREE.BoxGeometry(12, 1, 10), stoneMat);
    stoneBase.position.set(0, 0.5, 0);
    cabinGroup.add(stoneBase);

    // 2. Paredes de la cabaña
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(12, 4.5, 0.4), woodWallMat); 
    backWall.position.set(0, 3.25, -4.8);
    
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.5, 10), woodWallMat); 
    leftWall.position.set(-5.8, 3.25, 0);
    
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.5, 10), woodWallMat); 
    rightWall.position.set(5.8, 3.25, 0);

    const frontLeft = new THREE.Mesh(new THREE.BoxGeometry(4.6, 4.5, 0.4), woodWallMat); 
    frontLeft.position.set(-3.7, 3.25, 4.8);
    
    const frontRight = new THREE.Mesh(new THREE.BoxGeometry(4.6, 4.5, 0.4), woodWallMat); 
    frontRight.position.set(3.7, 3.25, 4.8);
    
    const frontTop = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.3, 0.4), woodWallMat); 
    frontTop.position.set(0, 4.85, 4.8);

    // 3. Ventanas y puerta
    const winLeft = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 0.2), glassMat); 
    winLeft.position.set(-3.5, 3.2, 4.9);
    
    const winRight = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 0.2), glassMat); 
    winRight.position.set(3.5, 3.2, 4.9);

    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.3, 0.2), woodDarkMat);
    doorFrame.position.set(0, 2.55, 4.75);

    // 4. Techo
    const roof = new THREE.Mesh(new THREE.ConeGeometry(9.2, 3.8, 4), roofMat);
    roof.position.y = 7.3; 
    roof.rotation.y = Math.PI / 4;

    // --- DECORACIÓN INTERIOR (Muebles, camas, chimenea y alfombra) ---
    const floorInside = new THREE.Mesh(new THREE.PlaneGeometry(11.2, 9.2), woodDarkMat);
    floorInside.rotation.x = -Math.PI / 2; 
    floorInside.position.set(0, 1.01, 0);

    // Camas a los lados
    const bedLeft = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 3.5), new THREE.MeshBasicMaterial({ color: 0x9f1239 }));
    bedLeft.position.set(-4, 1.4, -2.5);
    const bedRight = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 3.5), new THREE.MeshBasicMaterial({ color: 0x1e3a8a }));
    bedRight.position.set(4, 1.4, -2.5);

    // Chimenea acogedora al fondo
    const fireplace = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 1.5), new THREE.MeshBasicMaterial({ color: 0x1c1917 }));
    fireplace.position.set(0, 2.5, -4.1);
    const fireGlow = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 0.4), new THREE.MeshBasicMaterial({ color: 0xf97316 }));
    fireGlow.position.set(0, 1.8, -3.3);

    // Alfombra roja en el centro
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(3, 3.5), new THREE.MeshBasicMaterial({ color: 0x7f1d1d }));
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 1.02, 0.5);

    cabinGroup.add(stoneBase, backWall, leftWall, rightWall, frontLeft, frontRight, frontTop, winLeft, winRight, doorFrame, roof, floorInside, bedLeft, bedRight, fireplace, fireGlow, rug);
    
    cabinGroup.position.set(0, 0, -20);
    scene.add(cabinGroup);

    // Bosque de pinos alrededor
    const treesGroup = new THREE.Group();
    for(let i = 0; i < 60; i++) {
        const tree = new THREE.Group();
        const foliage = new THREE.Mesh(new THREE.ConeGeometry(3.6, 14, 6), new THREE.MeshBasicMaterial({ color: 0x072e13 }));
        foliage.position.y = 7;
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 4, 6), new THREE.MeshBasicMaterial({ color: 0x24180c }));
        trunk.position.y = 2;
        tree.add(foliage, trunk);
        const angle = Math.random() * Math.PI * 2, radius = 28 + Math.random() * 90;
        tree.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        treesGroup.add(tree);
    }
    scene.add(treesGroup);
}