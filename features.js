// --- LÓGICA DE EXTRAS Y PEGATINAS FLOTANTES ---

document.addEventListener('DOMContentLoaded', () => {
    initFloatingStickers();
});

// Generar pegatinas flotantes románticas en los bordes automáticamente
function initFloatingStickers() {
    const stickersPool = ['💖', '✨', '⭐', '💌', '🌸', '🧸', '💫', '🎀'];
    const container = document.body;

    // Evitar duplicar si ya existen
    if (document.querySelector('.floating-sticker')) return;

    // Crear 6 stickers distribuidos en los márgenes
    for (let i = 0; i < 6; i++) {
        const span = document.createElement('span');
        span.classList.add('floating-sticker');
        span.textContent = stickersPool[Math.floor(Math.random() * stickersPool.length)];
        
        span.style.position = 'absolute';
        span.style.top = `${Math.random() * 80 + 10}%`;
        span.style.left = i % 2 === 0 ? `${Math.random() * 8 + 2}%` : `${Math.random() * 8 + 90}%`;
        span.style.fontSize = '1.8rem';
        span.style.pointerEvents = 'none';
        span.style.zIndex = '1';
        span.style.opacity = '0.6';
        span.style.animation = `stickerFloat 6s ease-in-out infinite alternate`;
        span.style.animationDelay = `${Math.random() * 2}s`;

        container.appendChild(span);
    }
}