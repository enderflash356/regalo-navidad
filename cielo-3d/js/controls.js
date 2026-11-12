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

// ==========================================
// 1. EVENTOS DE TECLADO (PC)
// ==========================================
window.addEventListener('keydown', (e) => {
    if (['w','W','ArrowUp'].includes(e.key)) moveState.forward = 1;
    if (['s','S','ArrowDown'].includes(e.key)) moveState.forward = -1;
    if (['d','D','ArrowRight'].includes(e.key)) moveState.right = 1;
    if (['a','A','ArrowLeft'].includes(e.key)) moveState.right = -1;
    if (e.key === 'e' || e.key === 'E') {
        if (typeof triggerInteraction === 'function') triggerInteraction();
    }
});

window.addEventListener('keyup', (e) => {
    if (['w','W','s','S','ArrowUp','ArrowDown'].includes(e.key)) moveState.forward = 0;
    if (['a','A','d','D','ArrowLeft','ArrowRight'].includes(e.key)) moveState.right = 0;
});


// ==========================================
// 2. CREAR CONTROLES TÁCTILES Y GESTOS (CELULAR)
// ==========================================
function createMobileControls() {
    if (document.getElementById('virtual-joystick-container')) return;

    // Contenedor de la cruceta de movimiento (Esquina Inferior Izquierda)
    const container = document.createElement('div');
    container.id = 'virtual-joystick-container';
    container.style.cssText = `
        position: fixed; bottom: 30px; left: 30px; z-index: 99999;
        display: grid; grid-template-columns: 65px 65px 65px; grid-template-rows: 65px 65px;
        gap: 6px; user-select: none; touch-action: none;
    `;

    const createBtn = (text, gridArea, onDown, onUp) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            grid-area: ${gridArea}; background: rgba(15, 23, 42, 0.8); color: white;
            border: 2px solid rgba(255, 255, 255, 0.4); border-radius: 16px;
            font-size: 24px; font-weight: bold; display: flex; align-items: center;
            justify-content: center; outline: none; cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5); -webkit-tap-highlight-color: transparent;
        `;
        
        const activate = (e) => { 
            e.preventDefault(); 
            onDown(); 
            btn.style.background = 'rgba(56, 189, 248, 0.8)'; 
        };
        
        const deactivate = (e) => { 
            if (e) e.preventDefault(); 
            onUp(); 
            btn.style.background = 'rgba(15, 23, 42, 0.8)'; 
        };

        // Eventos táctiles robustos para que no se queden pegados
        btn.addEventListener('touchstart', activate, { passive: false });
        btn.addEventListener('touchend', deactivate, { passive: false });
        btn.addEventListener('touchcancel', deactivate, { passive: false });
        
        // Soporte por si se abre en emulador o pantalla táctil con mouse
        btn.addEventListener('mousedown', activate);
        btn.addEventListener('mouseup', deactivate);
        btn.addEventListener('mouseleave', deactivate);
        
        return btn;
    };

    const btnUp = createBtn('▲', '1 / 2 / 2 / 3', () => moveState.forward = 1, () => moveState.forward = 0);
    const btnLeft = createBtn('◀', '2 / 1 / 3 / 2', () => moveState.right = -1, () => moveState.right = 0);
    const btnDown = createBtn('▼', '2 / 2 / 3 / 3', () => moveState.forward = -1, () => moveState.forward = 0);
    const btnRight = createBtn('▶', '2 / 3 / 3 / 4', () => moveState.right = 1, () => moveState.right = 0);

    container.appendChild(btnUp);
    container.appendChild(btnLeft);
    container.appendChild(btnDown);
    container.appendChild(btnRight);
    document.body.appendChild(container);


    // ==========================================
    // 3. ASEGURAR INTERACCIÓN TÁCTIL EN EL BOTÓN DE ABRE/ENTRA
    // ==========================================
    const interactBtn = document.getElementById('interact-btn');
    if (interactBtn) {
        interactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof triggerInteraction === 'function') triggerInteraction();
        });
        interactBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (typeof triggerInteraction === 'function') triggerInteraction();
        }, { passive: false });
    }


    // ==========================================
    // 4. CAPTURA DE GESTOS TÁCTILES PARA GIRAR LA CÁMARA
    // ==========================================
    let isDragging = false;
    let prevTouchX = 0;
    let prevTouchY = 0;

    window.addEventListener('touchstart', (e) => {
        // Ignorar si toca la cruceta o los botones de interfaz
        if (e.target.closest('#virtual-joystick-container') || e.target.closest('#interact-btn') || e.target.closest('#loc-btn')) {
            return;
        }
        if (e.touches.length === 1) {
            isDragging = true;
            prevTouchX = e.touches[0].clientX;
            prevTouchY = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        
        const deltaX = currentX - prevTouchX;
        const deltaY = currentY - prevTouchY;
        
        prevTouchX = currentX;
        prevTouchY = currentY;

        if (typeof yawObject !== 'undefined' && typeof pitchObject !== 'undefined') {
            yawObject.rotation.y -= deltaX * 0.004;
            pitchObject.rotation.x -= deltaY * 0.004;
            pitchObject.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitchObject.rotation.x));
        } else if (typeof camera !== 'undefined') {
            camera.rotation.y -= deltaX * 0.004;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// Iniciar controles táctiles de inmediato y también al cargar la ventana
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    createMobileControls();
} else {
    window.addEventListener('DOMContentLoaded', createMobileControls);
    window.addEventListener('load', createMobileControls);
}