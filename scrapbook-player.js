/**
 * Romantic Scrapbook Floating Audio Player & Interactive Playlist Modal
 * Real Audio Playback with Downloaded MP3 Tracks
 * Handcrafted with love for Kartik's Birthday Scrapbook
 */
(() => {
  const TRACKS = [
    {
      id: 1,
      title: "Sun Meri Baat",
      artist: "Prateek Kuhad",
      album: "Shehron Ke Raaz",
      src: "assets/music/sun_meri_baat.mp3",
      vibe: "Soft acoustic confession",
      color: "#97472e"
    },
    {
      id: 2,
      title: "Kaafi Hai Naaa",
      artist: "Prateek Kuhad",
      album: "Cold/mess & Singles",
      src: "assets/music/kaafi_hai_naaa.mp3",
      vibe: "Comforting warm melody",
      color: "#4e0514"
    },
    {
      id: 3,
      title: "Maine Khudko",
      artist: "Mustafa Zahid",
      album: "Ragini MMS 2",
      src: "assets/music/maine_khudko.mp3",
      vibe: "Soulful heartfelt longing",
      color: "#885217"
    },
    {
      id: 4,
      title: "Piya",
      artist: "Khwaab",
      album: "Khwaab - Single",
      src: "assets/music/piya_khwaab.mp3",
      vibe: "Dreamy indie romance",
      color: "#735a39"
    }
  ];

  let currentTrackIdx = 0;
  let isModalOpen = false;

  // Real HTML5 Audio Element
  const audio = new Audio();
  audio.preload = "auto";

  // Restore state from sessionStorage if available
  try {
    const savedIdx = sessionStorage.getItem("kartik_scrapbook_track_idx");
    if (savedIdx !== null && !isNaN(parseInt(savedIdx, 10))) {
      currentTrackIdx = parseInt(savedIdx, 10) % TRACKS.length;
    }
  } catch(e) {}

  audio.src = TRACKS[currentTrackIdx].src;

  const formatTime = (sec) => {
    if (isNaN(sec) || sec < 0) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // DOM Elements for Floating Widget
  const playerButton = document.querySelector('[aria-label="Play or pause"]');
  const floatingAside = playerButton?.closest('aside');
  const titleEl = floatingAside?.querySelector('.font-caption-typewriter.font-bold');
  const subtitleEl = floatingAside?.querySelector('.font-caption-typewriter.text-\\[11px\\]');
  const icon = playerButton?.querySelector('.material-symbols-outlined');
  const disc = floatingAside?.querySelector('.animate-spin-slow, .w-8.h-8');
  const progressBar = floatingAside?.querySelector('.bg-secondary');
  const timer = floatingAside?.querySelector('.text-\\[10px\\]');
  const prevBtn = floatingAside?.querySelector('[aria-label="Previous track"]');
  const nextBtn = floatingAside?.querySelector('[aria-label="Next track"]');

  // Inject Pop-Up Modal Styles & Elements
  function injectModal() {
    if (document.getElementById('scrapbook-music-modal')) return;

    const modalContainer = document.createElement('div');
    modalContainer.id = 'scrapbook-music-modal';
    modalContainer.className = 'fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-3 sm:p-6 opacity-0 pointer-events-none transition-all duration-300';
    modalContainer.style.background = 'rgba(28, 22, 20, 0.65)';
    modalContainer.style.backdropFilter = 'blur(6px)';

    modalContainer.innerHTML = `
      <div id="scrapbook-modal-card" class="relative w-full max-w-md bg-[#fcf8f4] text-[#2b2320] rounded-2xl p-5 sm:p-6 shadow-2xl border border-[#e3d7cf] transform translate-y-6 sm:translate-y-4 scale-95 transition-all duration-300 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        
        <!-- Washi Tape Decor -->
        <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 -rotate-2 w-28 h-5 bg-[#e4ba9c]/80 rounded-sm shadow-xs flex items-center justify-center pointer-events-none z-10">
          <span class="text-[9px] font-mono tracking-widest text-[#5c3e32] uppercase">now playing</span>
        </div>

        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-dashed border-[#d5c3b7] pb-3 pt-1">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-[#97472e] text-white flex items-center justify-center shadow-xs">
              <span class="material-symbols-outlined text-[18px]">music_note</span>
            </div>
            <div>
              <h3 class="font-serif font-bold text-[18px] text-[#4e0514] leading-tight">Our Soundtrack</h3>
              <p class="font-mono text-[10px] text-[#78645b]">4 original songs for Kartik &amp; Kanika</p>
            </div>
          </div>
          <button id="close-music-modal" class="w-8 h-8 rounded-full bg-[#efe4dc] text-[#5c3e32] hover:bg-[#4e0514] hover:text-white transition-colors flex items-center justify-center text-[16px] font-bold" title="Close player">
            ✕
          </button>
        </div>

        <!-- Now Playing Hero Card -->
        <div class="bg-gradient-to-br from-[#f6eee7] to-[#ede2d8] rounded-xl p-4 border border-[#e0d2c7] shadow-inner flex flex-col gap-3">
          <div class="flex items-center gap-4">
            <!-- Spinning Vinyl Record -->
            <div class="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#1c1614] flex items-center justify-center shadow-md shrink-0 transition-transform duration-700" id="modal-spinning-vinyl">
              <div class="w-7 h-7 rounded-full bg-[#97472e] border-2 border-[#f6eee7] flex items-center justify-center shadow-inner">
                <div class="w-2 h-2 rounded-full bg-[#f6eee7]"></div>
              </div>
              <div class="absolute inset-1 rounded-full border border-white/10 pointer-events-none"></div>
              <div class="absolute inset-2.5 rounded-full border border-white/5 pointer-events-none"></div>
            </div>

            <div class="flex flex-col flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="bg-[#97472e] text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider" id="modal-track-tag">Track 01</span>
                <span class="text-[10px] font-mono text-[#97472e] font-semibold italic truncate" id="modal-track-vibe">Soft acoustic confession</span>
              </div>
              <h4 class="font-serif font-bold text-[17px] text-[#4e0514] truncate mt-0.5" id="modal-active-title">Sun Meri Baat</h4>
              <p class="font-mono text-[11px] text-[#78645b] truncate" id="modal-active-artist">Prateek Kuhad • Shehron Ke Raaz</p>
            </div>
          </div>

          <!-- Scrubbable Progress Bar -->
          <div class="flex flex-col gap-1">
            <div class="relative w-full h-2.5 bg-[#dbcbbe] rounded-full overflow-hidden cursor-pointer shadow-inner" id="modal-progress-container">
              <div class="h-full bg-[#97472e] w-0 rounded-full transition-all duration-100" id="modal-progress-fill"></div>
            </div>
            <div class="flex items-center justify-between font-mono text-[10px] text-[#78645b]">
              <span id="modal-elapsed-time">00:00</span>
              <div class="flex items-center gap-1">
                <span class="w-1 h-2 bg-[#97472e] rounded-full inline-block modal-wave-bar"></span>
                <span class="w-1 h-3 bg-[#97472e] rounded-full inline-block modal-wave-bar"></span>
                <span class="w-1 h-1.5 bg-[#97472e] rounded-full inline-block modal-wave-bar"></span>
              </div>
              <span id="modal-total-time">--:--</span>
            </div>
          </div>

          <!-- Audio Controls -->
          <div class="flex items-center justify-center gap-4 pt-1">
            <button id="modal-prev-btn" class="w-9 h-9 rounded-full bg-[#fdfaf7] text-[#4e0514] hover:bg-[#4e0514] hover:text-white transition-all shadow-xs flex items-center justify-center active:scale-95" title="Previous song">
              <span class="material-symbols-outlined text-[20px]">skip_previous</span>
            </button>
            <button id="modal-play-btn" class="w-12 h-12 rounded-full bg-[#4e0514] text-white hover:bg-[#97472e] transition-all shadow-md flex items-center justify-center active:scale-95" title="Play or Pause">
              <span class="material-symbols-outlined text-[26px]" id="modal-play-icon">play_arrow</span>
            </button>
            <button id="modal-next-btn" class="w-9 h-9 rounded-full bg-[#fdfaf7] text-[#4e0514] hover:bg-[#4e0514] hover:text-white transition-all shadow-xs flex items-center justify-center active:scale-95" title="Next song">
              <span class="material-symbols-outlined text-[20px]">skip_next</span>
            </button>
          </div>
        </div>

        <!-- Song Selection List -->
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center justify-between px-1">
            <span class="font-mono text-[11px] font-bold text-[#4e0514] uppercase tracking-wider">Select Track to Play</span>
            <span class="font-mono text-[9px] text-[#78645b]">1-Click Switch</span>
          </div>
          <div class="flex flex-col gap-1.5" id="modal-tracklist-container">
            ${TRACKS.map((t, idx) => `
              <div data-track-index="${idx}" class="track-item-card flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${idx === currentTrackIdx ? 'bg-[#97472e]/10 border-[#97472e] shadow-xs' : 'bg-[#f7f0e9] border-[#e4d8ce] hover:bg-[#f0e5dc]'}">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-7 h-7 rounded-full ${idx === currentTrackIdx ? 'bg-[#97472e] text-white' : 'bg-[#e2d3c7] text-[#5c3e32]'} flex items-center justify-center font-mono text-[11px] font-bold shrink-0 track-index-badge">
                    ${idx + 1}
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="font-serif font-bold text-[14px] text-[#2b2320] truncate track-item-title">${t.title}</span>
                    <span class="font-mono text-[10px] text-[#78645b] truncate">${t.artist} • <span class="italic text-[#97472e]">${t.vibe}</span></span>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="material-symbols-outlined text-[20px] ${idx === currentTrackIdx ? 'text-[#97472e]' : 'text-[#a08f85]'} track-status-icon">
                    ${idx === currentTrackIdx ? 'volume_up' : 'play_circle'}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Bottom Romantic Note -->
        <div class="pt-2 border-t border-dashed border-[#d5c3b7] text-center font-mono text-[10px] text-[#78645b] flex items-center justify-center gap-1">
          <span>♥ Handcrafted with all my love for Kartik • by Kanika</span>
        </div>

      </div>
    `;

    document.body.appendChild(modalContainer);

    // Modal Events
    const backdrop = document.getElementById('scrapbook-music-modal');
    const closeBtn = document.getElementById('close-music-modal');
    const modalPlayBtn = document.getElementById('modal-play-btn');
    const modalPrevBtn = document.getElementById('modal-prev-btn');
    const modalNextBtn = document.getElementById('modal-next-btn');
    const modalProgressContainer = document.getElementById('modal-progress-container');

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    closeBtn.addEventListener('click', closeModal);

    modalPlayBtn.addEventListener('click', togglePlay);
    modalPrevBtn.addEventListener('click', prevTrack);
    modalNextBtn.addEventListener('click', nextTrack);

    modalProgressContainer.addEventListener('click', (e) => {
      const rect = modalProgressContainer.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      if (audio.duration) {
        audio.currentTime = audio.duration * pct;
        updateDisplay();
      }
    });

    // Track rows click
    document.querySelectorAll('.track-item-card').forEach((card) => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-track-index'), 10);
        setTrack(idx);
      });
    });

    // ESC key listener
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isModalOpen) closeModal();
    });
  }

  function openModal() {
    injectModal();
    const modal = document.getElementById('scrapbook-music-modal');
    const card = document.getElementById('scrapbook-modal-card');
    if (!modal || !card) return;

    isModalOpen = true;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');
    card.classList.remove('translate-y-6', 'scale-95');
    card.classList.add('translate-y-0', 'scale-100');
    updateDisplay();
  }

  function closeModal() {
    const modal = document.getElementById('scrapbook-music-modal');
    const card = document.getElementById('scrapbook-modal-card');
    if (!modal || !card) return;

    isModalOpen = false;
    modal.classList.remove('opacity-100', 'pointer-events-auto');
    modal.classList.add('opacity-0', 'pointer-events-none');
    card.classList.remove('translate-y-0', 'scale-100');
    card.classList.add('translate-y-6', 'scale-95');
  }

  function updateDisplay() {
    const track = TRACKS[currentTrackIdx];
    const isPlaying = !audio.paused && !audio.ended && audio.currentTime > 0;
    const curTime = audio.currentTime || 0;
    const dur = audio.duration || 0;
    const pct = dur > 0 ? (curTime / dur) * 100 : 0;

    // 1. Floating bottom-right widget update
    if (titleEl) titleEl.textContent = track.title;
    if (subtitleEl) subtitleEl.textContent = `• ${track.artist}`;
    if (icon) icon.textContent = isPlaying ? 'pause' : 'play_arrow';
    if (disc) disc.classList.toggle('animate-spin-slow', isPlaying);
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (timer) timer.textContent = dur > 0 ? `${formatTime(curTime)} / ${formatTime(dur)}` : `${formatTime(curTime)}`;

    // 2. Pop-up Modal updates
    const modalActiveTitle = document.getElementById('modal-active-title');
    const modalActiveArtist = document.getElementById('modal-active-artist');
    const modalTrackTag = document.getElementById('modal-track-tag');
    const modalTrackVibe = document.getElementById('modal-track-vibe');
    const modalPlayIcon = document.getElementById('modal-play-icon');
    const modalProgressFill = document.getElementById('modal-progress-fill');
    const modalElapsedTime = document.getElementById('modal-elapsed-time');
    const modalTotalTime = document.getElementById('modal-total-time');
    const modalSpinningVinyl = document.getElementById('modal-spinning-vinyl');

    if (modalActiveTitle) modalActiveTitle.textContent = track.title;
    if (modalActiveArtist) modalActiveArtist.textContent = `${track.artist} • ${track.album}`;
    if (modalTrackTag) modalTrackTag.textContent = `TRACK 0${track.id}`;
    if (modalTrackVibe) modalTrackVibe.textContent = track.vibe;
    if (modalPlayIcon) modalPlayIcon.textContent = isPlaying ? 'pause' : 'play_arrow';
    if (modalProgressFill) modalProgressFill.style.width = `${pct}%`;
    if (modalElapsedTime) modalElapsedTime.textContent = formatTime(curTime);
    if (modalTotalTime) modalTotalTime.textContent = dur > 0 ? formatTime(dur) : "--:--";
    if (modalSpinningVinyl) modalSpinningVinyl.classList.toggle('animate-spin-slow', isPlaying);

    // Wave bars in modal
    const waveBars = document.querySelectorAll('.modal-wave-bar');
    if (isPlaying) {
      waveBars.forEach((bar, i) => {
        bar.style.height = `${Math.floor(Math.sin(Date.now() / 180 + i) * 6 + 10)}px`;
      });
    }

    // Highlight active card in modal tracklist
    const trackCards = document.querySelectorAll('.track-item-card');
    trackCards.forEach((card, idx) => {
      const badge = card.querySelector('.track-index-badge');
      const statusIcon = card.querySelector('.track-status-icon');

      if (idx === currentTrackIdx) {
        card.className = 'track-item-card flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer bg-[#97472e]/12 border-[#97472e] shadow-xs scale-[1.01]';
        if (badge) {
          badge.className = 'w-7 h-7 rounded-full bg-[#97472e] text-white flex items-center justify-center font-mono text-[11px] font-bold shrink-0 track-index-badge shadow-xs';
        }
        if (statusIcon) {
          statusIcon.className = 'material-symbols-outlined text-[20px] text-[#97472e] track-status-icon';
          statusIcon.textContent = isPlaying ? 'volume_up' : 'play_circle';
        }
      } else {
        card.className = 'track-item-card flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer bg-[#f7f0e9] border-[#e4d8ce] hover:bg-[#f0e5dc]';
        if (badge) {
          badge.className = 'w-7 h-7 rounded-full bg-[#e2d3c7] text-[#5c3e32] flex items-center justify-center font-mono text-[11px] font-bold shrink-0 track-index-badge';
        }
        if (statusIcon) {
          statusIcon.className = 'material-symbols-outlined text-[18px] text-[#a08f85] track-status-icon';
          statusIcon.textContent = 'play_circle';
        }
      }
    });
    // Update drawer current track label if available
    const drawerTrackEl = document.getElementById('drawer-current-track');
    if (drawerTrackEl) {
      drawerTrackEl.textContent = `${isPlaying ? 'Playing: ' : 'Track: '}${track.title} • ${track.artist}`;
    }
  }

  function loadTrack(idx, autoPlay = true) {
    currentTrackIdx = (idx + TRACKS.length) % TRACKS.length;
    try {
      sessionStorage.setItem("kartik_scrapbook_track_idx", currentTrackIdx);
    } catch(e) {}
    audio.src = TRACKS[currentTrackIdx].src;
    audio.currentTime = 0;
    updateDisplay();
    if (autoPlay) {
      audio.play().then(() => updateDisplay()).catch(() => updateDisplay());
    }
  }

  function togglePlay() {
    if (audio.paused) {
      audio.play().then(() => updateDisplay()).catch(() => updateDisplay());
    } else {
      audio.pause();
      updateDisplay();
    }
  }

  function nextTrack() {
    loadTrack(currentTrackIdx + 1, true);
  }

  function prevTrack() {
    loadTrack(currentTrackIdx - 1, true);
  }

  function setTrack(idx) {
    loadTrack(idx, true);
  }

  // Audio Event Listeners
  audio.addEventListener('timeupdate', updateDisplay);
  audio.addEventListener('loadedmetadata', updateDisplay);
  audio.addEventListener('play', updateDisplay);
  audio.addEventListener('pause', updateDisplay);
  audio.addEventListener('ended', nextTrack);

  // Bind click listeners on floating bottom-right bar
  if (floatingAside) {
    floatingAside.style.cursor = 'pointer';
    floatingAside.addEventListener('click', (e) => {
      if (e.target.closest('button[aria-label="Play or pause"]')) {
        togglePlay();
        return;
      }
      if (e.target.closest('button[aria-label="Previous track"]')) {
        prevTrack();
        return;
      }
      if (e.target.closest('button[aria-label="Next track"]')) {
        nextTrack();
        return;
      }
      if (isModalOpen) closeModal();
      else openModal();
    });

    if (disc) {
      disc.setAttribute('title', 'Click to open Soundtrack Playlist');
    }
  }

  // Mobile Navigation Drawer System
  function injectMobileNav() {
    if (document.getElementById('scrapbook-mobile-drawer')) return;

    const drawerWrapper = document.createElement('div');
    drawerWrapper.id = 'scrapbook-mobile-drawer';
    drawerWrapper.className = 'fixed inset-0 z-[9995] opacity-0 pointer-events-none transition-opacity duration-300';
    
    // Detect active page based on window.location
    const rawPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentPath = rawPath === '' ? 'index.html' : rawPath;
    
    const navItems = [
      {
        path: 'index.html',
        match: ['index.html', ''],
        title: 'Our Story',
        chapter: 'Chapter 01',
        icon: 'auto_stories',
        desc: 'How it started & our journey'
      },
      {
        path: 'memory-lane.html',
        match: ['memory-lane.html'],
        title: 'Memory Lane',
        chapter: 'Chapter 02',
        icon: 'photo_library',
        desc: 'Polaroids & candid moments'
      },
      {
        path: 'reasons.html',
        match: ['reasons.html'],
        title: '25 Reasons',
        chapter: 'Chapter 03',
        icon: 'favorite',
        desc: 'Why I adore you so much'
      },
      {
        path: 'letters.html',
        match: ['letters.html'],
        title: 'Letters & Wishes',
        chapter: 'Chapter 04',
        icon: 'mail',
        desc: 'Heartfelt words & memories'
      },
      {
        path: 'surprise.html',
        match: ['surprise.html'],
        title: 'Birthday Surprise',
        chapter: 'Chapter 05',
        icon: 'redeem',
        desc: 'A special birthday gift reveal'
      }
    ];

    const linksHtml = navItems.map((item) => {
      const isActive = item.match.includes(currentPath);
      return `
        <a href="${item.path}" class="flex items-center gap-3.5 p-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-[#6c1d28] text-white shadow-md transform translate-x-1' 
            : 'bg-[#f4eae1]/80 hover:bg-[#ede0d4] text-[#2b2320] hover:translate-x-1'
        }">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            isActive ? 'bg-[#97472e] text-white' : 'bg-[#e4ba9c]/40 text-[#97472e]'
          }">
            <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
          </div>
          <div class="flex flex-col min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-[10px] uppercase font-mono tracking-widest ${isActive ? 'text-[#f5b8c0]' : 'text-[#885217]'}">${item.chapter}</span>
              ${isActive ? '<span class="text-[9px] bg-[#97472e] text-white px-1.5 py-0.2 rounded-full font-mono">CURRENT</span>' : ''}
            </div>
            <span class="font-serif font-medium text-[15px] leading-snug truncate ${isActive ? 'text-white' : 'text-[#2b2320]'}">${item.title}</span>
            <span class="text-[11px] font-mono leading-tight truncate ${isActive ? 'text-[#f1ccd2]' : 'text-[#735a39]'}">${item.desc}</span>
          </div>
        </a>
      `;
    }).join('');

    drawerWrapper.innerHTML = `
      <!-- Backdrop Overlay -->
      <div id="scrapbook-drawer-backdrop" class="absolute inset-0 bg-[#2b2320]/60 backdrop-blur-xs transition-opacity cursor-pointer"></div>

      <!-- Slide Panel -->
      <div id="scrapbook-drawer-panel" class="absolute top-0 right-0 h-full w-[85%] max-w-[340px] bg-[#fcf8f4] text-[#2b2320] shadow-2xl border-l border-[#e4d6cc] flex flex-col justify-between p-5 transform translate-x-full transition-transform duration-300 ease-out z-10 overflow-y-auto">
        
        <!-- Header -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between border-b border-[#e9ded5] pb-3.5">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-[#97472e] flex items-center justify-center text-white shadow-xs">
                <span class="material-symbols-outlined text-[17px]">auto_stories</span>
              </div>
              <div class="flex flex-col">
                <span class="font-serif text-[17px] font-semibold text-[#4e0514] leading-tight">Our Scrapbook</span>
                <span class="text-[11px] font-mono text-[#735a39] tracking-wider">vol. xvii • birthday edition</span>
              </div>
            </div>
            <button id="scrapbook-drawer-close" aria-label="Close menu" class="w-8 h-8 rounded-full hover:bg-[#ebdcd1] flex items-center justify-center text-[#5c3e32] transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Washi Tape Decor & Chapter count -->
          <div class="flex items-center justify-between px-1">
            <span class="text-[10px] font-mono uppercase tracking-widest text-[#885217]">Table of Contents</span>
            <span class="text-[10px] font-mono bg-[#e4ba9c]/40 text-[#5c3e32] px-2 py-0.5 rounded-sm">5 Chapters</span>
          </div>
        </div>

        <!-- Navigation Chapter Links -->
        <nav class="flex flex-col gap-2.5 my-3">
          ${linksHtml}
        </nav>

        <!-- Bottom Actions & Footer -->
        <div class="flex flex-col gap-2.5 pt-3 border-t border-[#e9ded5]">
          <!-- Soundtrack Quick Launcher -->
          <button id="drawer-soundtrack-btn" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#e4ba9c]/25 hover:bg-[#e4ba9c]/40 text-[#5c3e32] border border-[#e4ba9c]/50 transition-colors cursor-pointer text-left">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="material-symbols-outlined text-[#97472e] text-[18px]">music_note</span>
              <div class="flex flex-col min-w-0">
                <span class="text-[12px] font-medium leading-none">Scrapbook Soundtrack</span>
                <span class="text-[10px] font-mono text-[#735a39] truncate" id="drawer-current-track">Playing: ${TRACKS[currentTrackIdx].title} • ${TRACKS[currentTrackIdx].artist}</span>
              </div>
            </div>
            <span class="material-symbols-outlined text-[18px] text-[#97472e]">play_circle</span>
          </button>

          <!-- Romantic Footer Stamp -->
          <div class="text-center py-1">
            <p class="text-[10px] font-mono text-[#735a39]">
              ♥ Handcrafted with all my love for Kartik • by Kanika
            </p>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(drawerWrapper);

    const backdrop = document.getElementById('scrapbook-drawer-backdrop');
    const panel = document.getElementById('scrapbook-drawer-panel');
    const closeBtn = document.getElementById('scrapbook-drawer-close');
    const soundtrackBtn = document.getElementById('drawer-soundtrack-btn');

    function openDrawer() {
      drawerWrapper.classList.remove('opacity-0', 'pointer-events-none');
      drawerWrapper.classList.add('opacity-100', 'pointer-events-auto');
      panel.classList.remove('translate-x-full');
      panel.classList.add('translate-x-0');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      panel.classList.remove('translate-x-0');
      panel.classList.add('translate-x-full');
      drawerWrapper.classList.remove('opacity-100', 'pointer-events-auto');
      drawerWrapper.classList.add('opacity-0', 'pointer-events-none');
      document.body.style.overflow = '';
    }

    backdrop?.addEventListener('click', closeDrawer);
    closeBtn?.addEventListener('click', closeDrawer);

    soundtrackBtn?.addEventListener('click', () => {
      closeDrawer();
      setTimeout(openModal, 200);
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !drawerWrapper.classList.contains('pointer-events-none')) {
        closeDrawer();
      }
    });

    // Attach listener to mobile menu toggle buttons
    function bindMenuToggles() {
      document.querySelectorAll('#mobile-menu-toggle, [data-action="open-mobile-menu"]').forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openDrawer();
        };
      });
    }

    bindMenuToggles();
  }

  // Setup DOM injection on DOM ready
  const initScrapbook = () => {
    injectModal();
    injectMobileNav();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrapbook);
  } else {
    initScrapbook();
  }

  // Global methods
  window.scrapbookAudio = {
    togglePlay,
    nextTrack,
    prevTrack,
    setTrack,
    openPlaylist: openModal,
    closePlaylist: closeModal,
    getTracks: () => TRACKS,
    getCurrentTrack: () => TRACKS[currentTrackIdx],
    isPlaying: () => !audio.paused && !audio.ended && audio.currentTime > 0
  };

  updateDisplay();
})();
