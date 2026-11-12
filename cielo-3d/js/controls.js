const moveState = { forward: 0, right: 0 };
const walkSpeed = 0.14;
let insideCabin = false; // Empezamos en el bosque frente a la cabaña

function checkCollision(newX, newZ) {
    // La cabaña está centrada en Z = -20
    const cabinZ = newZ - (-20);

    if (insideCabin) {
        // Si estás dentro, límites de las 4 paredes interiores
        if (newX < -5.4 || newX > 5.4 || cabinZ < -4.4 || cabinZ > 4.4) {
            // Umbral libre de la puerta en la pared frontal (Z local ≈ 4.8)
            if (Math.abs(newX) < 1.4 && cabinZ >= 4.2 && cabinZ <= 5.4) {
                return false; // ¡Puedes salir sin chocar!
            }
            return true; // Choca con paredes interiores
        }
    } else {
        // Si estás fuera, bloquea entrar traspasando paredes cuadradas
        if (newX > -5.8 && newX < 5.8 && cabinZ > -4.8 && cabinZ < 5.2) {
            // Umbral libre para entrar por la puerta principal
            if (Math.abs(newX) < 1.4 && cabinZ >= 4.2 && cabinZ <= 5.4) {
                return false; // ¡Puedes entrar!
            }
            return true; // Choca con paredes exteriores
        }
    }
    return false;
}

window.addEventListener('keydown', (e) => {
    if (['w','W','ArrowUp'].includes(e.key)) moveState.forward = 1;
    if (['s','S','ArrowDown'].includes(e.key)) moveState.forward = -1;
    if (['d','D','ArrowRight'].includes(e.key)) moveState.right = 1;
    if (['a','A','ArrowLeft'].includes(e.key)) moveState.right = -1;
    if (e.key === 'e' || e.key === 'E') triggerInteraction();
});

window.addEventListener('keyup', (e) => {
    if (['w','W','s','S','ArrowUp','ArrowDown'].includes(e.key)) moveState.forward = 0;
    if (['a','A','d','D','ArrowLeft','ArrowRight'].includes(e.key)) moveState.right = 0;
});