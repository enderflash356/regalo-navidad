const introLines = [
    "11 de octubre de 2026... 18:32 horas.",
    "Bajo el crepúsculo de Mixco y Huacho...",
    "El cielo guarda los recuerdos de nuestro inicio.",
    "Explora el bosque, entra a la cabaña y descubre cada momento..."
];
let lineIndex = 0, charIndex = 0, isTyping = true, audioCtx = null;
const dialogueTextEl = document.getElementById('dialogue-text');

function playSound(freq, duration = 0.08) {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle'; 
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain); 
        gain.connect(audioCtx.destination);
        osc.start(); 
        osc.stop(audioCtx.currentTime + duration);
    } catch(e) {}
}

function typeWriter() {
    if (!isTyping) return;
    if (lineIndex < introLines.length) {
        const line = introLines[lineIndex];
        if (charIndex < line.length) {
            dialogueTextEl.textContent += line.charAt(charIndex);
            if (line.charAt(charIndex) !== ' ') playSound(320 + Math.random() * 100);
            charIndex++; 
            setTimeout(typeWriter, 40);
        } else {
            setTimeout(() => { charIndex = 0; lineIndex++; dialogueTextEl.textContent = ""; typeWriter(); }, 1400);
        }
    } else { 
        skipIntro(); 
    }
}

function skipIntro() {
    isTyping = false;
    const overlay = document.getElementById('intro-overlay');
    if(overlay) { 
        overlay.style.opacity = '0'; 
        setTimeout(() => overlay.remove(), 400); 
    }
}

window.addEventListener('click', () => { if (!audioCtx && document.getElementById('intro-overlay')) typeWriter(); }, { once: true });
setTimeout(() => { if (document.getElementById('intro-overlay') && !audioCtx) typeWriter(); }, 500);

let musicPlaying = false;
const bgAudio = document.getElementById('bg-audio');

function toggleMusic() {
    const btn = document.getElementById('music-btn');
    if (!musicPlaying) {
        bgAudio.play().then(() => { 
            musicPlaying = true; 
            if(btn) { btn.textContent = "🎵 Música: On 💖"; btn.style.borderColor = "#22c55e"; }
        }).catch(err => console.log("Play pausado:", err));
    } else {
        bgAudio.pause(); 
        musicPlaying = false; 
        if(btn) { btn.textContent = "🎵 Música: Off"; btn.style.borderColor = "rgba(244,63,94,0.4)"; }
    }
}

// Intentar reproducir automáticamente al cargar la página
window.addEventListener('load', () => {
    if (bgAudio) {
        bgAudio.volume = 0.5;
        bgAudio.play().then(() => {
            musicPlaying = true;
            const btn = document.getElementById('music-btn');
            if(btn) { btn.textContent = "🎵 Música: On 💖"; btn.style.borderColor = "#22c55e"; }
        }).catch(() => {
            // Plan de respaldo: si el navegador bloquea el autoplay, suena en el primer toque o tecla
            const unlockAudio = () => {
                bgAudio.play().then(() => {
                    musicPlaying = true;
                    const btn = document.getElementById('music-btn');
                    if(btn) { btn.textContent = "🎵 Música: On 💖"; btn.style.borderColor = "#22c55e"; }
                    window.removeEventListener('click', unlockAudio);
                    window.removeEventListener('keydown', unlockAudio);
                    window.removeEventListener('touchstart', unlockAudio);
                });
            };
            window.addEventListener('click', unlockAudio);
            window.addEventListener('keydown', unlockAudio);
            window.addEventListener('touchstart', unlockAudio);
        });
    }
});