// --- CONFIGURACIÓN DE CONEXIÓN A GITHUB ---
const GITHUB_USER = "enderflash356";
const GITHUB_REPO = "regalo-navidad";

// Obtener el token de forma segura desde el navegador (se pedirá solo 1 vez)
function getGitHubToken() {
    let token = localStorage.getItem('gf_gh_token');
    if (!token) {
        token = prompt("🔒 Pega tu Token de GitHub por única vez para activar el editor:");
        if (token) {
            localStorage.setItem('gf_gh_token', token.trim());
        }
    }
    return token ? token.trim() : "";
}

document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('advent-grid');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalMedia = document.getElementById('modal-media');
    const modalClose = document.getElementById('modal-close');

    // Modal de Día Bloqueado (Custom Alert)
    const lockedModal = document.getElementById('locked-modal');
    const lockedModalMsg = document.getElementById('locked-modal-msg');
    const lockedModalClose = document.getElementById('locked-modal-close');

    // Barra de Progreso
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    // --- OBTENER HORA ACTUAL EXACTA DE PERÚ (America/Lima / UTC-5) ---
    function getPeruDate() {
        const now = new Date();
        const peruTimeString = now.toLocaleString("en-US", { timeZone: "America/Lima" });
        return new Date(peruTimeString);
    }

    // --- 1. EASTER EGG DE HORA NOCTURNA (Basado en Hora Perú) ---
    function checkNightTime() {
        const peruHour = getPeruDate().getHours();
        if (peruHour >= 22 || peruHour < 6) {
            const header = document.querySelector('header');
            if (header && !document.getElementById('night-banner')) {
                const banner = document.createElement('div');
                banner.id = 'night-banner';
                banner.classList.add('night-banner');
                banner.innerHTML = '🌙 ¿Qué haces despierta tan tarde, mi niña? Ve a descansar pronto, te amo infinitamente... ✨';
                header.insertBefore(banner, header.firstChild);
            }
        }
    }
    checkNightTime();

    // --- REPRODUCTOR TIPO JUKEBOX / VINILO ---
    const playlist = [
        { title: "1. Paradero - R4ve", src: "media/musica1.mp3" },
        { title: "2. Change - Deftones", src: "media/musica2.mp3" },
        { title: "3. Cherry Waves - Deftones", src: "media/musica3.mp3" },
        { title: "4. Fluorescent Adolescent - Arctic Monkeys", src: "media/musica4.mp3" },
        { title: "5. Secret Door - Arctic Monkeys", src: "media/musica5.mp3" },
        { title: "6. Sweet Dreams, TN - TLSP", src: "media/musica6.mp3" },
        { title: "7. Body to Body - BTS", src: "media/musica7.mp3" },
        { title: "8. Not Allowed - TV Girl", src: "media/musica8.mp3" },
        { title: "9. The Truth Untold - BTS", src: "media/musica9.mp3" },
        { title: "10. Outro: Tear - BTS", src: "media/musica10.mp3" },
        { title: "11. When You Sleep - MBV", src: "media/musica11.mp3" },
        { title: "12. Capable of Love - PinkPantheress", src: "media/musica12.mp3" },
        { title: "13. The Cure - Olivia Rodrigo", src: "media/musica13.mp3" },
        { title: "14. Her - The American Dawn", src: "media/musica14.mp3" },
        { title: "15. Té para 3 - Soda Stereo", src: "media/musica15.mp3" }
    ];

    let currentTrackIndex = 0;
    const musicBtn = document.getElementById('music-btn');
    const musicIcon = document.getElementById('music-icon');
    const songSelect = document.getElementById('song-select');
    const nextSongBtn = document.getElementById('next-song-btn');
    const bgMusic = document.getElementById('bg-music');
    const vinylDisc = document.getElementById('vinyl-disc');
    const equalizer = document.getElementById('equalizer');
    let isPlaying = false;
    let noteInterval = null;

    if (songSelect) {
        songSelect.innerHTML = '';
        playlist.forEach((song, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = song.title;
            songSelect.appendChild(option);
        });
    }

    function spawnMusicNote() {
        if (!vinylDisc) return;
        const rect = vinylDisc.getBoundingClientRect();
        const note = document.createElement('span');
        note.classList.add('floating-note');
        note.textContent = ['🎶', '🎵', '🎼', '✨'][Math.floor(Math.random() * 4)];
        note.style.left = `${rect.left + rect.width / 2}px`;
        note.style.top = `${rect.top}px`;
        document.body.appendChild(note);
        setTimeout(() => note.remove(), 2000);
    }

    function loadTrack(index) {
        currentTrackIndex = index;
        bgMusic.src = playlist[currentTrackIndex].src;
        if (songSelect) songSelect.value = currentTrackIndex;
    }

    function playTrack() {
        bgMusic.play().then(() => {
            isPlaying = true;
            if (musicIcon) musicIcon.textContent = '⏸️';
            if (vinylDisc) vinylDisc.classList.add('spinning');
            if (equalizer) equalizer.classList.add('active');
            if (!noteInterval) noteInterval = setInterval(spawnMusicNote, 1200);
        }).catch((error) => {
            console.log("Reproducción pausada o bloqueada por política del navegador:", error);
        });
    }

    function pauseTrack() {
        bgMusic.pause();
        isPlaying = false;
        if (musicIcon) musicIcon.textContent = '▶️';
        if (vinylDisc) vinylDisc.classList.remove('spinning');
        if (equalizer) equalizer.classList.remove('active');
        if (noteInterval) { clearInterval(noteInterval); noteInterval = null; }
    }

    // --- MÚSICA AUTOMÁTICA Y ALEATORIA AL ENTRAR ---
    if (bgMusic && playlist.length > 0) {
        const randomStart = Math.floor(Math.random() * playlist.length);
        loadTrack(randomStart);
        playTrack();
        
        document.addEventListener('click', () => {
            if (!isPlaying) {
                playTrack();
            }
        }, { once: true });
    }

    if (musicBtn && bgMusic) {
        musicBtn.addEventListener('click', () => {
            if (isPlaying) {
                pauseTrack();
            } else {
                playTrack();
            }
        });
    }

    if (songSelect) {
        songSelect.addEventListener('change', (e) => {
            loadTrack(parseInt(e.target.value));
            playTrack();
        });
    }

    if (nextSongBtn) {
        nextSongBtn.addEventListener('click', () => {
            let nextIndex;
            if (playlist.length > 1) {
                do {
                    nextIndex = Math.floor(Math.random() * playlist.length);
                } while (nextIndex === currentTrackIndex);
            } else {
                nextIndex = 0;
            }
            loadTrack(nextIndex);
            playTrack();
        });
    }

    if (bgMusic) {
        bgMusic.addEventListener('ended', () => {
            let nextIndex = (currentTrackIndex + 1) % playlist.length;
            loadTrack(nextIndex);
            playTrack();
        });
    }

    const btnHug = document.getElementById('btn-hug');
    const btnKiss = document.getElementById('btn-kiss');
    const countHugs = document.getElementById('count-hugs');
    const countKisses = document.getElementById('count-kisses');

    const lovePopup = document.getElementById('love-popup');
    const lovePopupTitle = document.getElementById('love-popup-title');
    const lovePopupGif = document.getElementById('love-popup-gif');
    const lovePopupMsg = document.getElementById('love-popup-msg');
    const lovePopupClose = document.getElementById('love-popup-close');

    // Elementos del Panel Admin
    const editorModal = document.getElementById('editor-modal');
    const editorClose = document.getElementById('editor-close');
    const editDayNum = document.getElementById('edit-day-num');
    const editTitle = document.getElementById('edit-title');
    const editContent = document.getElementById('edit-content');
    const editType = document.getElementById('edit-type');
    const editFile = document.getElementById('edit-file');
    const editColor = document.getElementById('edit-color');
    const editorSave = document.getElementById('editor-save');
    const editorPreview = document.getElementById('editor-preview');

    let devMode = false;
    let currentEditingDay = null;
    let currentFilter = 'all';
    let favorites = JSON.parse(localStorage.getItem('gf_favorites')) || [];

    // --- SISTEMA DE FILTROS ---
    function renderFilterBar() {
        const board = document.querySelector('.calendar-board-wrapper');
        if (!board || document.getElementById('filter-bar')) return;

        const filterBar = document.createElement('div');
        filterBar.id = 'filter-bar';
        filterBar.classList.add('filter-bar');
        
        const filters = [
            { id: 'all', label: 'Todos ✨' },
            { id: 'text', label: 'Cartas 💌' },
            { id: 'image', label: 'Fotos 📸' },
            { id: 'audio', label: 'Audios 🎙️' },
            { id: 'video', label: 'Videos 🎬' },
            { id: 'fav', label: 'Favoritos ⭐' }
        ];

        filters.forEach(f => {
            const chip = document.createElement('button');
            chip.classList.add('filter-chip');
            if (f.id === currentFilter) chip.classList.add('active');
            chip.textContent = f.label;
            chip.addEventListener('click', () => {
                currentFilter = f.id;
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                renderGrid();
            });
            filterBar.appendChild(chip);
        });

        const title = document.querySelector('.calendar-board-title');
        if (title) title.after(filterBar);
    }

    // --- CONTADOR PRINCIPAL PARA EL GRAN REGALO (25 DE DICIEMBRE EN HORA PERÚ) ---
    function updateCountdown() {
        const christmasDate = new Date('2026-12-25T00:00:00-05:00').getTime();
        const nowPeru = getPeruDate().getTime();
        const gap = christmasDate - nowPeru;

        if (gap < 0) return;

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const d = Math.floor(gap / day);
        const h = Math.floor((gap % day) / hour);
        const m = Math.floor((gap % hour) / minute);
        const s = Math.floor((gap % minute) / second);

        const elDays = document.getElementById('days');
        const elHours = document.getElementById('hours');
        const elMins = document.getElementById('mins');
        const elSecs = document.getElementById('secs');

        if (elDays) elDays.textContent = String(d).padStart(2, '0');
        if (elHours) elHours.textContent = String(h).padStart(2, '0');
        if (elMins) elMins.textContent = String(m).padStart(2, '0');
        if (elSecs) elSecs.textContent = String(s).padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Copos de nieve
    const snowContainer = document.getElementById('snowflakes');
    if (snowContainer) {
        for (let i = 0; i < 35; i++) {
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
            snowflake.style.left = `${Math.random() * 100}vw`;
            snowflake.style.top = `${Math.random() * 20}vh`;
            const size = Math.random() * 4 + 2;
            snowflake.style.width = `${size}px`;
            snowflake.style.height = `${size}px`;
            snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`;
            snowflake.style.animationDelay = `${Math.random() * 5}s`;
            snowContainer.appendChild(snowflake);
        }
    }

    // Cargar datos guardados
    let savedCustomData = JSON.parse(localStorage.getItem('gf_advent_custom')) || {};

    function getDaysData() {
        if (typeof adventDaysData === 'undefined') return [];
        return adventDaysData.map(item => {
            if (savedCustomData[item.day]) {
                return { ...item, ...savedCustomData[item.day] };
            }
            return item;
        });
    }

    const hugGifs = ["gifs/gif-abrazo-1.gif", "gifs/gif-abrazo-2.gif", "gifs/gif-abrazo-3.gif", "gifs/gif-abrazo-4.gif", "gifs/gif-abrazo-5.gif"];
    const kissGifs = ["gifs/gif-beso-1.gif", "gifs/gif-beso-2.gif", "gifs/gif-beso-3.gif"];
    const loveMessages = [
        "¡Un abracito de osito para que recuerdes cuánto te amo! ✨",
        "¡Te mando muuuuuchos besitos para llenar tu día de luz y amor je! 💖",
        "¡Recuerda que eres lo más bonito, tierno y especial que tengo en mi vida, mi niña preciosa! 🥰",
        "¡Un besote enorme hasta Perú, te amo mi linda jiji! 💌"
    ];

    let hugs = parseInt(localStorage.getItem('gf_hugs') || '0');
    let kisses = parseInt(localStorage.getItem('gf_kisses') || '0');
    if (countHugs) countHugs.textContent = hugs;
    if (countKisses) countKisses.textContent = kisses;

    function spawnFloatingEmoji(event, emojiList) {
        const rect = event.currentTarget.getBoundingClientRect();
        const emoji = document.createElement('span');
        emoji.classList.add('floating-heart');
        emoji.textContent = emojiList[Math.floor(Math.random() * emojiList.length)];
        const x = event.clientX || (rect.left + rect.width / 2);
        const y = event.clientY || rect.top;
        emoji.style.left = `${x + (Math.random() - 0.5) * 40}px`;
        emoji.style.top = `${y - 10}px`;
        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), 1200);
    }

    function showLovePopup(title, gifList) {
        if (!lovePopup) return;
        lovePopupTitle.textContent = title;
        lovePopupGif.src = gifList[Math.floor(Math.random() * gifList.length)];
        if (lovePopupMsg) lovePopupMsg.textContent = loveMessages[Math.floor(Math.random() * loveMessages.length)];
        lovePopup.classList.add('active');

        if (typeof confetti === 'function') {
            confetti({ particleCount: 30, spread: 70, origin: { y: 0.75 }, colors: ['#f43f5e', '#ec4899', '#fbbf24'] });
        }
    }

    if (lovePopupClose) lovePopupClose.addEventListener('click', () => lovePopup.classList.remove('active'));
    if (lovePopup) lovePopup.addEventListener('click', (e) => { if (e.target === lovePopup) lovePopup.classList.remove('active'); });

    if (btnHug) {
        btnHug.addEventListener('click', (e) => {
            hugs++; localStorage.setItem('gf_hugs', hugs); countHugs.textContent = hugs;
            spawnFloatingEmoji(e, ['🤗', '💖', '🫂', '✨']);
            showLovePopup("¡Abrazo de osito para tiiiii! 💖", hugGifs);
        });
    }

    if (btnKiss) {
        btnKiss.addEventListener('click', (e) => {
            kisses++; localStorage.setItem('gf_kisses', kisses); countKisses.textContent = kisses;
            spawnFloatingEmoji(e, ['💋', '😘', '💌', '❤️']);
            showLovePopup("¡Un besito rico para ti jejeje! ✨", kissGifs);
        });
    }

    // --- MODO PRUEBAS / DEV OCULTO (Ctrl + Shift + D) ---
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
            e.preventDefault();
            devMode = !devMode;
            renderGrid();

            const toast = document.createElement('div');
            toast.textContent = devMode ? "🔓 Modo Pruebas Activado (Todo Desbloqueado)" : "🔒 Modo Usuario Normal";
            toast.style.cssText = "position:fixed; top:20px; right:20px; background:#f43f5e; color:white; padding:12px 20px; border-radius:12px; z-index:99999; font-weight:bold; box-shadow:0 10px 25px rgba(0,0,0,0.5); font-family:'Inter', sans-serif;";
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2500);

            if (devMode && typeof confetti === 'function') {
                confetti({ particleCount: 80, spread: 100, origin: { y: 0.2 } });
            }
        }
    });

    function showLockedModal(date) {
        if (!lockedModal) return;
        lockedModalMsg.textContent = `Aún no es hora de abrir este regalito mi linda jeje... Se desbloquea el ${date} 💖`;
        lockedModal.classList.add('active');
    }

    if (lockedModalClose) lockedModalClose.addEventListener('click', () => lockedModal.classList.remove('active'));
    if (lockedModal) lockedModal.addEventListener('click', (e) => { if (e.target === lockedModal) lockedModal.classList.remove('active'); });

    function renderGrid() {
        if (!gridContainer) return;
        gridContainer.innerHTML = '';
        
        // Fecha actual exacta en Perú formateada en YYYY-MM-DD
        const peruNow = getPeruDate();
        const todayPeru = peruNow.toISOString().split('T')[0];

        const activeDaysData = getDaysData();
        let unlockedCount = 0;

        activeDaysData.forEach((item) => {
            const isDayZero = (item.day === 0);
            const isGrandGift = (item.day === 55);
            const isUnlocked = isDayZero || devMode || (todayPeru >= item.date);
            const isFav = favorites.includes(item.day);

            // Filtrado de elementos
            if (currentFilter !== 'all') {
                if (currentFilter === 'fav' && !isFav) return;
                if (currentFilter !== 'fav' && item.type !== currentFilter && !isDayZero && !isGrandGift) return;
            }

            const card = document.createElement('div');
            card.classList.add('day-card');

            if (isDayZero) {
                card.classList.add('day-zero');
            } else if (isGrandGift) {
                card.classList.add('grand-gift');
            }

            const isToday = (todayPeru === item.date);
            let timeBadgeHTML = '';

            if (!isUnlocked) {
                card.classList.add('locked');
                
                // Cálculo de tiempo restante basado en la medianoche de Perú (UTC-5)
                const unlockDate = new Date(`${item.date}T00:00:00-05:00`);
                const diff = unlockDate.getTime() - peruNow.getTime();

                if (diff > 0) {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                    
                    let badgeText = `Faltan ${days}d ${hours}h`;
                    if (days === 0) {
                        const mins = Math.floor((diff / 1000 / 60) % 60);
                        badgeText = `Faltan ${hours}h ${mins}m`;
                    }
                    if (isGrandGift) {
                        badgeText = `⌛ Faltan ${days}d y ${hours}h`;
                    }

                    timeBadgeHTML = `<span class="time-badge">${badgeText}</span>`;
                    card.setAttribute('data-countdown', badgeText);
                } else {
                    timeBadgeHTML = `<span class="time-badge">¡Hoy!</span>`;
                }
            } else {
                if (!isDayZero) unlockedCount++;
            }

            if (isToday && !devMode && !isGrandGift && !isDayZero) {
                card.classList.add('today');
            }

            const favIconHTML = isUnlocked && !isDayZero ? `<button class="fav-btn" title="Favorito">${isFav ? '⭐' : '☆'}</button>` : '';

            if (isDayZero) {
                card.innerHTML = `
                    <div class="day-num" style="font-size: 1.1rem; color: #fda4af;">Día 0</div>
                    <div class="status-icon" style="font-size: 1.8rem;">💌</div>
                    <div style="font-size: 0.85rem; color: #f8fafc; font-weight: 600;">Presiona aquí para tu primer regalo jiji... ✨</div> 
                `;
            } else {
                card.innerHTML = `
                    ${favIconHTML}
                    <div class="day-num">${item.day}</div>
                    <div class="status-icon">${isUnlocked ? (isGrandGift ? '👑🎁' : '🎁') : '🔒'}</div>
                    ${timeBadgeHTML}
                `;
            }

            // Manejo de clic en favorito
            const favBtn = card.querySelector('.fav-btn');
            if (favBtn) {
                favBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (favorites.includes(item.day)) {
                        favorites = favorites.filter(id => id !== item.day);
                    } else {
                        favorites.push(item.day);
                    }
                    localStorage.setItem('gf_favorites', JSON.stringify(favorites));
                    renderGrid();
                });
            }

            // Abrir carta en vista previa (o alert de bloqueado)
            card.addEventListener('click', () => {
                if (isUnlocked) {
                    card.classList.add('opening');
                    if (typeof confetti === 'function') {
                        confetti({ 
                            particleCount: isGrandGift ? 130 : (isDayZero ? 60 : 40), 
                            spread: isGrandGift ? 100 : 70, 
                            origin: { y: 0.6 }, 
                            colors: ['#f43f5e', '#fbbf24', '#ffffff'] 
                        });
                    }
                    setTimeout(() => card.classList.remove('opening'), 500);

                    openModal(item);
                } else {
                    showLockedModal(item.date);
                }
            });

            gridContainer.appendChild(card);
        });

        const total = 55;
        const percentage = Math.round((unlockedCount / total) * 100);
        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${unlockedCount} / ${total} Regalitos (${percentage}%)`;
    }

    function openEditor(item) {
        currentEditingDay = item.day;
        if (editDayNum) editDayNum.textContent = item.day;
        if (editTitle) editTitle.value = item.title || '';
        if (editContent) editContent.value = item.content || '';
        if (editType) editType.value = item.type || 'text';
        if (editColor) editColor.value = item.textColor || '#e2e8f0';
        if (editFile) editFile.value = ''; 
        if (editorModal) editorModal.classList.add('active');
    }

    // Botón de Vista Previa en el Editor
    if (editorPreview) {
        editorPreview.addEventListener('click', () => {
            const tempItem = {
                day: currentEditingDay,
                title: editTitle.value,
                content: editContent.value,
                type: editType.value,
                textColor: editColor ? editColor.value : '#e2e8f0',
                mediaUrl: (editFile && editFile.files[0]) ? URL.createObjectURL(editFile.files[0]) : (savedCustomData[currentEditingDay]?.mediaUrl || "")
            };
            openModal(tempItem);
        });
    }

    if (editorClose) editorClose.addEventListener('click', () => editorModal.classList.remove('active'));
    if (editorModal) editorModal.addEventListener('click', (e) => { if (e.target === editorModal) editorModal.classList.remove('active'); });

    // --- GUARDAR CAMBIOS AUTOMÁTICAMENTE EN GITHUB (CON TOKEN SEGURO) ---
    if (editorSave) {
        editorSave.addEventListener('click', async () => {
            const file = editFile.files[0];
            
            async function pushToGitHub(newMediaUrl = null) {
                const activeDaysData = getDaysData();
                const currentItem = activeDaysData.find(d => d.day === currentEditingDay);

                savedCustomData[currentEditingDay] = {
                    title: editTitle.value,
                    content: editContent.value,
                    type: editType.value,
                    textColor: editColor ? editColor.value : '#e2e8f0',
                    mediaUrl: newMediaUrl !== null ? newMediaUrl : (currentItem ? currentItem.mediaUrl : "")
                };

                // Actualizar localStorage también
                localStorage.setItem('gf_advent_custom', JSON.stringify(savedCustomData));

                // Construir el archivo datos.js actualizado
                const updatedArray = activeDaysData.map(item => {
                    const custom = savedCustomData[item.day] || {};
                    return {
                        day: item.day,
                        date: item.date,
                        title: custom.title !== undefined ? custom.title : (item.title || ""),
                        content: custom.content !== undefined ? custom.content : (item.content || ""),
                        type: custom.type !== undefined ? custom.type : (item.type || "text"),
                        textColor: custom.textColor !== undefined ? custom.textColor : (item.textColor || "#e2e8f0"),
                        mediaUrl: custom.mediaUrl !== undefined ? custom.mediaUrl : (item.mediaUrl || "")
                    };
                });

                const fileContentString = `const adventDaysData = ${JSON.stringify(updatedArray, null, 4)};`;
                const encodedContent = btoa(unescape(encodeURIComponent(fileContentString)));

                editorSave.textContent = "Guardando en la nube... ⏳";
                editorSave.disabled = true;

                try {
                    const GITHUB_TOKEN = getGitHubToken();
                    if (!GITHUB_TOKEN) {
                        alert("Se requiere el token de GitHub para guardar.");
                        return;
                    }

                    // 1. Obtener el SHA actual del archivo datos.js en GitHub
                    const getUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/datos.js`;
                    const getRes = await fetch(getUrl, {
                        headers: { "Authorization": `token ${GITHUB_TOKEN}` }
                    });

                    if (!getRes.ok) {
                        alert("Token inválido o error de autenticación con GitHub.");
                        localStorage.removeItem('gf_gh_token'); // Limpiar token malo si falla
                        return;
                    }

                    const fileData = await getRes.json();
                    const fileSha = fileData.sha;

                    // 2. Enviar el commit automático con los nuevos datos
                    const putRes = await fetch(getUrl, {
                        method: "PUT",
                        headers: {
                            "Authorization": `token ${GITHUB_TOKEN}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            message: `Actualización automática del Día ${currentEditingDay} desde el Editor ✨`,
                            content: encodedContent,
                            sha: fileSha
                        })
                    });

                    if (putRes.ok) {
                        alert("¡Guardado y publicado en la web con éxito! 💖");
                        editorModal.classList.remove('active');
                        renderGrid();
                    } else {
                        alert("Hubo un error al sincronizar con GitHub.");
                    }
                } catch (err) {
                    console.error(err);
                    alert("Error de conexión con GitHub.");
                } finally {
                    editorSave.textContent = "Guardar Cambios ✨";
                    editorSave.disabled = false;
                }
            }

            if (file) {
                const reader = new FileReader();
                reader.onload = function(uploadEvent) {
                    pushToGitHub(uploadEvent.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                pushToGitHub(null);
            }
        });
    }

    function openModal(item) {
        if (modalTitle) modalTitle.textContent = item.title || `Día ${item.day}`;
        if (modalBody) {
            modalBody.textContent = item.content || 'Muy pronto jejeje...';
            if (item.textColor) {
                modalBody.style.color = item.textColor;
            } else {
                modalBody.style.color = '#e2e8f0';
            }
        }
        if (modalMedia) modalMedia.innerHTML = '';

        // Botón rápido para abrir editor si estás en Modo Pruebas
        if (devMode) {
            const editBtnBtn = document.createElement('button');
            editBtnBtn.textContent = '✏️ Editar este Día';
            editBtnBtn.style.cssText = 'background:#22c55e; color:white; border:none; padding:6px 14px; border-radius:12px; font-weight:bold; cursor:pointer; margin-bottom:12px; font-size:0.85rem;';
            editBtnBtn.onclick = () => {
                if (modal) modal.classList.remove('active');
                openEditor(item);
            };
            modalMedia.appendChild(editBtnBtn);
        }

        // Elemento decorativo de sobre arriba
        const flap = document.createElement('div');
        flap.classList.add('envelope-header');
        modalMedia.appendChild(flap);

        if (item.mediaUrl && item.mediaUrl.trim() !== '') {
            if (item.type === 'photo' || item.type === 'image') {
                modalMedia.innerHTML += `<img src="${item.mediaUrl}" alt="Recuerdito jiji" />`;
            } else if (item.type === 'audio') {
                modalMedia.innerHTML += `
                    <div class="voice-note-card">
                        <div style="font-size: 0.85rem; color: #fb7185; font-weight: bold;">🎙️ Nota de voz especial para ti</div>
                        <div class="voice-waves">
                            <div class="wave-bar"></div>
                            <div class="wave-bar"></div>
                            <div class="wave-bar"></div>
                            <div class="wave-bar"></div>
                            <div class="wave-bar"></div>
                        </div>
                        <audio controls src="${item.mediaUrl}" style="width: 100%; border-radius: 12px;"></audio>
                    </div>
                `;
            } else if (item.type === 'video') {
                modalMedia.innerHTML += `<video controls src="${item.mediaUrl}" style="max-width: 100%; border-radius: 10px;"></video>`;
            }
        }
        if (modal) modal.classList.add('active');
    }

    if (modalClose) modalClose.addEventListener('click', () => modal.classList.remove('active'));
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

    renderFilterBar();
    renderGrid();
});