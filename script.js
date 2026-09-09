document.addEventListener('DOMContentLoaded', () => {
    const scaleWrap = document.getElementById('scaleWrap');
    const content = document.getElementById('mainContent');

    const sfxCheckbox = document.getElementById('sfxCheckbox');

    function playSound(src) {
        if (sfxCheckbox && !sfxCheckbox.checked) return;
        try {
            const a = new Audio(src);
            a.volume = 0.5;
            a.play();
        } catch (_) {}
    }

    function playSelect() { playSound('sounds/10.%20Select%20A.mp3'); }
    function playPageLeft() { playSound('sounds/08.%20Page%20Left.mp3'); }
    function playPageRight() { playSound('sounds/09.%20Page%20Right.mp3'); }

    function fitToScreen() {
        if (window.innerWidth < 700) {
            scaleWrap.style.transform = '';
            scaleWrap.style.width = '';
            scaleWrap.style.height = '';
            scaleWrap.style.left = '';
            return;
        }
        const baseW = 1366;
        const baseH = 768;
        const scaleX = window.innerWidth / baseW;
        const scaleY = window.innerHeight / baseH;
        const scale = Math.min(scaleX, scaleY) * 1.3;
        scaleWrap.style.transform = `translateX(-50%) scale(${scale})`;
        scaleWrap.style.width = `${baseW}px`;
        scaleWrap.style.height = `${baseH}px`;
    }

    fitToScreen();
    window.addEventListener('resize', fitToScreen);

    const tabs = document.querySelectorAll('.mini-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const navTiles = document.querySelectorAll('.tile-nav');
    const backButtons = document.querySelectorAll('.resume-back');
    const navTitle = document.getElementById('navTitle');
    const tabOrder = ['home', 'about', 'projects', 'vgd', 'heroconcepts', 'videogames', 'software', 'other', 'contact', 'resume', 'interests'];
    const navHistory = [];

    const tabLabels = {
        home: 'Home',
        about: 'About',
        projects: 'Projects',
        contact: 'Contact',
        resume: 'Resume',
        interests: 'Interests',
        vgd: 'Video Game Design',
        heroconcepts: 'Hero Concepts',
        videogames: 'Video Games',
        software: 'Software Development',
        other: 'Other Projects'
    };

    function switchTab(targetId, pushHistory = true, forcedDirection = null) {
        const currentTab = document.querySelector('.mini-tab.active');
        const currentId = currentTab ? currentTab.dataset.tab : 'home';

        if (pushHistory && currentId !== targetId) {
            navHistory.push(currentId);
        }

        const prevIndex = tabOrder.indexOf(currentId);
        const nextIndex = tabOrder.indexOf(targetId);
        const direction = forcedDirection || (nextIndex >= prevIndex ? 'right' : 'left');

        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === targetId);
        });

        tabContents.forEach(content => {
            content.classList.remove('active', 'slide-left', 'slide-right');
            if (content.id === `tab-${targetId}`) {
                content.classList.add('active', `slide-${direction}`);
            }
        });

        if (navTitle && tabLabels[targetId]) {
            navTitle.textContent = tabLabels[targetId];
        }

        document.querySelector('.content').scrollTop = 0;

        setTimeout(positionArrows, 50);
    }

    function goBack() {
        const prev = navHistory.pop();
        if (prev) {
            switchTab(prev, false);
        } else {
            switchTab('home', false);
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            playSelect();
            switchTab(tab.dataset.tab);
        });
    });

    navTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            playSelect();
            if (tile.classList.contains('tile-back')) {
                goBack();
            } else {
                switchTab(tile.dataset.tab);
            }
        });
    });

    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            playSelect();
            goBack();
        });
    });

    const interestReactiveBg = document.querySelector('.tile-interest-reactive-bg');
    const interestHoverTiles = document.querySelectorAll('.tile-interest-hover');
    const interestImages = {
        'Video Games': 'images/interests/game1.png',
        'Music': 'images/interests/band1.png',
        'Books & Comics': 'images/interests/book1.png'
    };

    if (interestReactiveBg) {
        interestReactiveBg.style.backgroundImage = "url('images/interests/game1.png')";
    }

    interestHoverTiles.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            const key = btn.dataset.interest;
            if (interestImages[key] && interestReactiveBg) {
                interestReactiveBg.style.backgroundImage = `url('${interestImages[key]}')`;
            }
        });
    });

    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;

    if (musicToggle && bgMusic) {
        const volumeSlider = document.getElementById('volumeSlider');
        const volIcon = document.getElementById('volIcon');
        const musicPlayBtn = document.getElementById('musicPlayBtn');
        bgMusic.volume = 0.3;

        if (volumeSlider) {
            volumeSlider.addEventListener('input', () => {
                bgMusic.volume = parseFloat(volumeSlider.value);
            });
        }

        function showNowPlaying() {
            const existing = document.querySelector('.music-toast');
            if (existing) existing.remove();
            const toast = document.createElement('div');
            toast.className = 'music-toast';
            toast.textContent = 'Now Playing: Witchy [Instrumental] - Kaytranada, Childish Gambino';
            document.body.appendChild(toast);
            requestAnimationFrame(() => toast.classList.add('show'));
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 4000);
        }

        function startMusic() {
            if (!isPlaying) {
                bgMusic.play().then(() => {
                    isPlaying = true;
                    musicPlayBtn.classList.add('playing');
                    musicPlayBtn.innerHTML = '&#9612;&#9612;';
                    showNowPlaying();
                }).catch(() => {});
            }
            document.removeEventListener('click', startMusic);
            document.removeEventListener('touchstart', startMusic);
        }
        document.addEventListener('click', startMusic);
        document.addEventListener('touchstart', startMusic);

        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelector('.music-player').classList.toggle('open');
        });

        musicPlayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isPlaying) {
                bgMusic.pause();
                musicPlayBtn.classList.remove('playing');
                musicPlayBtn.innerHTML = '&#9654;';
            } else {
                bgMusic.play().then(() => {
                    musicPlayBtn.classList.add('playing');
                    musicPlayBtn.innerHTML = '&#9612;&#9612;';
                }).catch(() => {});
            }
            isPlaying = !isPlaying;
        });
    }

    document.addEventListener('keydown', (e) => {
        const currentTab = document.querySelector('.mini-tab.active');
        const currentIndex = tabOrder.indexOf(currentTab.dataset.tab);

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            playPageLeft();
            const prevIndex = (currentIndex - 1 + tabOrder.length) % tabOrder.length;
            switchTab(tabOrder[prevIndex]);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            playPageRight();
            const nextIndex = (currentIndex + 1) % tabOrder.length;
            switchTab(tabOrder[nextIndex]);
        }
    });

    let touchStartX = 0;
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    document.addEventListener('touchend', (e) => {
        const activeTab = document.querySelector('.mini-tab.active');
        const activeId = activeTab ? activeTab.dataset.tab : '';
        const swipeTabs = ['home', 'about', 'projects', 'contact'];
        if (!swipeTabs.includes(activeId)) return;
        const dx = e.changedTouches[0].screenX - touchStartX;
        const dy = e.changedTouches[0].screenY - touchStartY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            adjacentTab(dx > 0 ? -1 : 1);
        }
    }, { passive: true });

    const easyModeBtn = document.getElementById('easyModeBtn');
    if (easyModeBtn) {
        const easyModeLabel = easyModeBtn.querySelector('.tile-text-bar h3');
        const updateEasyModeLabel = () => {
            if (easyModeLabel) {
                easyModeLabel.textContent = document.body.classList.contains('easy-mode') ? 'Back' : 'Easy Mode';
            }
        };
        easyModeBtn.addEventListener('click', () => {
            document.body.classList.toggle('easy-mode');
            updateEasyModeLabel();
        });
        updateEasyModeLabel();
    }

    const featuredTile = document.querySelector('#tab-projects .tile-project-featured');
    if (featuredTile) {
        const featuredBg = featuredTile.querySelector('.tile-featured-bg');
        const featuredTitle = featuredTile.querySelector('.tile-featured-title');
        const featuredDetail = featuredTile.querySelector('.tile-detail');
        const featuredTags = featuredTile.querySelector('.project-tags');

        const defaultFeatured = [
            { title: 'Tip Tracker', detail: 'Track and log your daily tips', tags: ['Software', 'Tips'], image: 'Projects/Software/TipTracker/tip_tracker.png', tab: 'software', file: 'Projects/Software/TipTracker/TipTracker.txt' },
            { title: 'Class Registration', detail: 'Azure Cloud & SQL', tags: ['Azure', 'SQL'], image: '', tab: 'software', file: 'Projects/Software/ClassRegistration/ClassRegistration.txt' },
            { title: 'Music Maker', detail: 'JavaFX song builder', tags: ['Java', 'JavaFX'], image: '', tab: 'software', file: 'Projects/Software/MusicMaker/MusicMaker.txt' },
            { title: 'Design Patterns', detail: 'Decorator, Observer, State & more', tags: ['Design', 'Patterns'], image: '', tab: 'software', file: 'Projects/Software/DesignPatterns/DesignPatterns.txt' },
            { title: 'Portfolio', detail: 'This website!', tags: ['Web'], image: '', tab: 'software', file: 'Projects/Software/Portfolio/Portfolio.txt' },
            { title: 'AIS Charon', detail: 'Godot metroidvania in development', tags: ['Godot', 'GDScript'], image: 'Projects/Video%20Games/AISCharon/ais_charon.png', tab: 'videogames', file: 'Projects/Video%20Games/AISCharon/AISCharon.txt' },
            { title: 'Goat of Goats', detail: 'The ultimate goat ranking', tags: ['Fun'], image: '', tab: 'other', file: 'Projects/Other/GoatOfGoats/GoatOfGoats.txt' },
            { title: 'Nightcrawler', detail: 'Duelist/DPS concept', tags: ['Marvel Rivals', 'DPS'], image: 'Projects/Hero%20Concepts/NightcrawlerMR/NightcrawlerMR.png', tab: 'heroconcepts', file: 'Projects/Hero%20Concepts/NightcrawlerMR/NightcrawlerMR.txt' },
            { title: 'Professor X', detail: 'Strategist/Support concept', tags: ['Marvel Rivals', 'Support'], image: 'Projects/Hero%20Concepts/ProfXMR/ProfXMR.png', tab: 'heroconcepts', file: 'Projects/Hero%20Concepts/ProfXMR/ProfXMR.txt' },
            { title: 'Ghost Rider', detail: 'Duelist/DPS concept', tags: ['Marvel Rivals', 'DPS'], image: 'Projects/Hero%20Concepts/GhostRiderMR/GhostRiderMR.png', tab: 'heroconcepts', file: 'Projects/Hero%20Concepts/GhostRiderMR/GhostRiderMR.txt' },
            { title: 'Juggernaut', detail: 'Vanguard/Tank concept', tags: ['Marvel Rivals', 'Tank'], image: 'Projects/Hero%20Concepts/JuggernautMR/JuggernautMR.png', tab: 'heroconcepts', file: 'Projects/Hero%20Concepts/JuggernautMR/JuggernautMR.txt' },
            { title: 'Ace', detail: 'Overwatch DPS concept', tags: ['Overwatch', 'DPS'], image: 'Projects/Hero%20Concepts/Ace/AceOW.png', tab: 'heroconcepts', file: 'Projects/Hero%20Concepts/Ace/Ace.txt' }
        ];

        let featuredProjects = defaultFeatured.slice();
        let featuredIndex = Math.floor(Math.random() * featuredProjects.length);
        let featuredTimer = null;

        const renderFeatured = (i) => {
            const p = featuredProjects[i];
            if (featuredBg) featuredBg.style.backgroundImage = p.image ? `url('${p.image}')` : '';
            if (featuredTitle) featuredTitle.textContent = p.title;
            if (featuredDetail) featuredDetail.textContent = p.detail;
            if (featuredTags) {
                featuredTags.innerHTML = '';
                p.tags.forEach(t => {
                    const span = document.createElement('span');
                    span.className = 'tag small';
                    span.textContent = t;
                    featuredTags.appendChild(span);
                });
            }
        };

        const cycleFeatured = () => {
            let next;
            do {
                next = Math.floor(Math.random() * featuredProjects.length);
            } while (next === featuredIndex && featuredProjects.length > 1);
            featuredIndex = next;
            renderFeatured(featuredIndex);
        };

        const startFeaturedTimer = () => {
            if (featuredTimer) clearInterval(featuredTimer);
            featuredTimer = setInterval(cycleFeatured, 2000);
        };

        renderFeatured(featuredIndex);
        startFeaturedTimer();
        loadTile('projects/featured', d => {
            if (d && Array.isArray(d.projects) && d.projects.length) {
                featuredProjects = d.projects;
                featuredIndex = Math.floor(Math.random() * featuredProjects.length);
                renderFeatured(featuredIndex);
                startFeaturedTimer();
            }
        });

        featuredTile.addEventListener('click', () => {
            const p = featuredProjects[featuredIndex];
            playSelect();
            if (p && p.tab) switchTab(p.tab);
            if (p && p.file) openProjectModal(p.file);
        });
        featuredTile.addEventListener('mouseenter', () => clearInterval(featuredTimer));
        featuredTile.addEventListener('mouseleave', startFeaturedTimer);
    }

    /* =========================================== */
    /* TILE DATA FILES                             */
    /* Tiles load their content from data/<tab>/   */
    /* =========================================== */
    function applyText(el, val) {
        if (el && typeof val === 'string' && val) el.textContent = val;
    }

    function applyImage(el, img) {
        if (!el) return;
        if (typeof img === 'string' && img) el.style.backgroundImage = `url('${img}')`;
        else if (typeof img === 'string') el.style.backgroundImage = '';
    }

    function loadTile(file, apply) {
        fetch(`data/${file}.json`)
            .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
            .then(apply)
            .catch(() => {});
    }

    loadTile('home/avatar', d => {
        const t = document.querySelector('#tab-home .tile-avatar');
        if (!t) return;
        applyText(t.querySelector('.avatar-name'), d.name);
        applyImage(t.querySelector('.tile-avatar-bg'), d.image);
    });

    let homeFeaturedNav = { tab: 'software', file: 'Projects/Software/TipTracker/TipTracker.txt' };
    const homeFeaturedEl = document.querySelector('#tab-home .tile-featured');
    if (homeFeaturedEl) {
        homeFeaturedEl.addEventListener('click', () => {
            playSelect();
            if (homeFeaturedNav.tab) switchTab(homeFeaturedNav.tab);
            if (homeFeaturedNav.file) openProjectModal(homeFeaturedNav.file);
        });
    }
    loadTile('home/featured', d => {
        const t = document.querySelector('#tab-home .tile-featured');
        if (!t) return;
        applyText(t.querySelector('.tile-label'), d.label);
        applyText(t.querySelector('.tile-featured-title'), d.title);
        applyImage(t.querySelector('.tile-featured-bg'), d.image);
        if (d.tab) homeFeaturedNav.tab = d.tab;
        if (d.file) homeFeaturedNav.file = d.file;
    });

    loadTile('home/contact', d => {
        const t = document.querySelector('#tab-home .tile-social');
        if (!t) return;
        applyText(t.querySelector('h3'), d.label);
        applyImage(t.querySelector('.tile-social-bg'), d.image);
    });

    loadTile('home/projects', d => {
        const t = document.querySelector('#tab-home .tile-projects-home');
        if (!t) return;
        applyText(t.querySelector('h3'), d.label);
        applyImage(t.querySelector('.tile-project-bg'), d.image);
    });

    loadTile('about/resume', d => {
        const t = document.querySelector('#tab-about .tile-resume');
        if (!t) return;
        applyText(t.querySelector('.tile-label'), d.label);
        applyText(t.querySelector('h3'), d.title);
        applyText(t.querySelector('.tile-detail'), d.detail);
        applyImage(t.querySelector('.tile-resume-bg'), d.image);
    });

    loadTile('about/university', d => {
        const t = document.querySelector('#tab-about .tile-university');
        if (!t) return;
        applyText(t.querySelector('h3'), d.title);
        applyImage(t.querySelector('.tile-university-bg'), d.image);
    });

    loadTile('about/twin', d => {
        const t = document.querySelector('#tab-about .tile-twin');
        if (!t) return;
        applyText(t.querySelector('.tile-label'), d.label);
        applyText(t.querySelector('h3'), d.title);
        applyImage(t.querySelector('.tile-twin-bg'), d.image);
        if (typeof d.link === 'string' && d.link) t.href = d.link;
    });

    loadTile('about/learning', d => {
        const t = document.querySelector('#tab-about .tile-learning');
        if (!t) return;
        applyText(t.querySelector('.tile-label'), d.label);
        const tagsBox = t.querySelector('.skill-tags');
        if (tagsBox && Array.isArray(d.tags)) {
            tagsBox.innerHTML = '';
            d.tags.forEach(tag => {
                const span = document.createElement('span');
                span.className = 'tag';
                span.textContent = tag;
                tagsBox.appendChild(span);
            });
        }
    });

    loadTile('about/interests', d => {
        const t = document.querySelector('#tab-about .tile-interest-about');
        if (!t) return;
        applyText(t.querySelector('.tile-label'), d.label);
        applyText(t.querySelector('h3'), d.title);
        applyText(t.querySelector('.tile-detail'), d.detail);
        applyImage(t.querySelector('.tile-interest-about-bg'), d.image);
    });

    loadTile('projects/vgd', d => {
        const t = document.querySelector('#tab-projects .tile-project-vgd');
        if (!t) return;
        applyText(t.querySelector('h3'), d.title);
        applyImage(t.querySelector('.tile-videogame-bg'), d.image);
    });

    loadTile('projects/software', d => {
        const t = document.querySelector('#tab-projects .tile-project-coding');
        if (!t) return;
        applyText(t.querySelector('h3'), d.title);
    });

    loadTile('projects/other', d => {
        const t = document.querySelector('#tab-projects .tile-project-other');
        if (!t) return;
        applyText(t.querySelector('h3'), d.title);
    });

    loadTile('projects/dog', d => {
        const t = document.querySelector('#tab-projects .tile-dog');
        if (!t) return;
        applyText(t.querySelector('h3'), d.title);
        applyImage(t.querySelector('.tile-dog-bg'), d.image);
    });

    const updateReactiveBg = () => {
        if (interestReactiveBg) {
            interestReactiveBg.style.backgroundImage = `url('${interestImages['Video Games']}')`;
        }
    };

    loadTile('interests/games', d => {
        const t = document.querySelector('.tile-interest-hover[data-interest="Video Games"]');
        if (!t) return;
        applyText(t.querySelector('h3'), d.title);
        applyImage(t.querySelector('.tile-interest-bg'), d.image);
        if (typeof d.reactive === 'string' && d.reactive) interestImages['Video Games'] = d.reactive;
        updateReactiveBg();
    });

    loadTile('interests/music', d => {
        const t = document.querySelector('.tile-interest-hover[data-interest="Music"]');
        if (!t) return;
        applyText(t.querySelector('h3'), d.title);
        applyImage(t.querySelector('.tile-interest-bg'), d.image);
        if (typeof d.reactive === 'string' && d.reactive) interestImages['Music'] = d.reactive;
    });

    loadTile('interests/books', d => {
        const t = document.querySelector('.tile-interest-hover[data-interest="Books & Comics"]');
        if (!t) return;
        applyText(t.querySelector('h3'), d.title);
        applyImage(t.querySelector('.tile-interest-bg'), d.image);
        if (typeof d.reactive === 'string' && d.reactive) interestImages['Books & Comics'] = d.reactive;
    });

    /* Project tiles (Software, Video Games, Other, Hero Concepts) */
    function applyProjectTile(d, file) {
        const t = document.querySelector(`[data-file="${file}"]`);
        if (!t) return;
        applyText(t.querySelector('.tile-label'), d.label);
        applyText(t.querySelector('h3'), d.title);
        applyText(t.querySelector('.tile-detail'), d.detail);
        applyImage(t.querySelector('.tile-hero-bg'), d.image);
        const tagsBox = t.querySelector('.project-tags');
        if (tagsBox && Array.isArray(d.tags)) {
            tagsBox.innerHTML = '';
            d.tags.forEach(tag => {
                const s = document.createElement('span');
                s.className = 'tag small';
                s.textContent = tag;
                tagsBox.appendChild(s);
            });
        }
        if (Array.isArray(d.tags)) t.dataset.tags = d.tags.join(',');
    }

    loadTile('software/class-registration', d => applyProjectTile(d, 'Projects/Software/ClassRegistration/ClassRegistration.txt'));
    loadTile('software/music-maker', d => applyProjectTile(d, 'Projects/Software/MusicMaker/MusicMaker.txt'));
    loadTile('software/design-patterns', d => applyProjectTile(d, 'Projects/Software/DesignPatterns/DesignPatterns.txt'));
    loadTile('software/tip-tracker', d => applyProjectTile(d, 'Projects/Software/TipTracker/TipTracker.txt'));
    loadTile('software/portfolio', d => applyProjectTile(d, 'Projects/Software/Portfolio/Portfolio.txt'));
    loadTile('other/goat-of-goats', d => applyProjectTile(d, 'Projects/Other/GoatOfGoats/GoatOfGoats.txt'));
    loadTile('videogames/ais-charon', d => applyProjectTile(d, 'Projects/Video%20Games/AISCharon/AISCharon.txt'));
    loadTile('heroconcepts/nightcrawler', d => applyProjectTile(d, 'Projects/Hero%20Concepts/NightcrawlerMR/NightcrawlerMR.txt'));
    loadTile('heroconcepts/prof-x', d => applyProjectTile(d, 'Projects/Hero%20Concepts/ProfXMR/ProfXMR.txt'));
    loadTile('heroconcepts/ant-man-wasp', d => applyProjectTile(d, 'Projects/Hero%20Concepts/AntManWaspMR/AntManWaspMR.txt'));
    loadTile('heroconcepts/daredevil', d => applyProjectTile(d, 'Projects/Hero%20Concepts/DaredevilMR/DaredevilMR.txt'));
    loadTile('heroconcepts/ghost-rider', d => applyProjectTile(d, 'Projects/Hero%20Concepts/GhostRiderMR/GhostRiderMR.txt'));
    loadTile('heroconcepts/ghost-rider-vanguard', d => applyProjectTile(d, 'Projects/Hero%20Concepts/GhostRiderVanguardMR/GhostRiderVanguardMR.txt'));
    loadTile('heroconcepts/juggernaut', d => applyProjectTile(d, 'Projects/Hero%20Concepts/JuggernautMR/JuggernautMR.txt'));
    loadTile('heroconcepts/miles-morales', d => applyProjectTile(d, 'Projects/Hero%20Concepts/MilesMoralesMR/MilesMoralesMR.txt'));
    loadTile('heroconcepts/ace', d => applyProjectTile(d, 'Projects/Hero%20Concepts/Ace/Ace.txt'));
    loadTile('heroconcepts/doc-ock', d => applyProjectTile(d, 'Projects/Hero%20Concepts/DocOckMR/DocOckMR.txt'));

    function positionArrows() {
        if (window.innerWidth < 700) {
            if (navArrowLeft) navArrowLeft.style.top = '';
            if (navArrowRight) navArrowRight.style.top = '';
            return;
        }
        const activeTab = document.querySelector('.tab-content.active');
        const activeId = activeTab ? activeTab.id.replace('tab-', '') : '';
        if (activeId === 'resume' || activeId === 'interests' || activeId === 'vgd' || activeId === 'heroconcepts' || activeId === 'software' || activeId === 'other') {
            if (navArrowLeft) navArrowLeft.style.display = 'none';
            if (navArrowRight) navArrowRight.style.display = 'none';
            return;
        }
        if (navArrowLeft) navArrowLeft.style.display = '';
        if (navArrowRight) navArrowRight.style.display = '';
        const tileGrid = document.querySelector('.tab-content.active .tile-grid, .tab-content.active .resume-screen');
        if (tileGrid) {
            const rect = tileGrid.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const arrowHeight = 80;
            const topPx = centerY - arrowHeight / 2;
            if (navArrowLeft) navArrowLeft.style.top = topPx + 'px';
            if (navArrowRight) navArrowRight.style.top = topPx + 'px';
        }
    }

    const navArrowLeft = document.getElementById('navArrowLeft');
    const navArrowRight = document.getElementById('navArrowRight');

    function adjacentTab(direction) {
        if (direction === -1) playPageLeft();
        else playPageRight();
        const mainTabs = ['home', 'about', 'projects', 'contact'];
        const currentTab = document.querySelector('.mini-tab.active');
        const currentId = currentTab ? currentTab.dataset.tab : 'home';
        const currentIndex = mainTabs.indexOf(currentId);
        const slideDirection = direction === 1 ? 'right' : 'left';
        if (currentIndex === -1) {
            switchTab(direction === 1 ? 'home' : 'contact', true, slideDirection);
            return;
        }
        const nextIndex = (currentIndex + direction + mainTabs.length) % mainTabs.length;
        switchTab(mainTabs[nextIndex], true, slideDirection);
    }

    if (navArrowLeft) {
        navArrowLeft.addEventListener('click', () => adjacentTab(-1));
    }

    if (navArrowRight) {
        navArrowRight.addEventListener('click', () => adjacentTab(1));
    }

    positionArrows();
    window.addEventListener('resize', positionArrows);

    const heroModal = document.getElementById('heroModal');
    const heroModalBody = document.getElementById('heroModalBody');
    const heroModalClose = document.getElementById('heroModalClose');

    const heroContent = {
        'Projects/Hero%20Concepts/NightcrawlerMR/NightcrawlerMR.txt': `

Nightcrawler Character Concept I made (1/2)

A Duelist/DPS character

---

Don't know why I said "(1/2)" it's gonna be longer my b

For his primary fire I'd of course do the 2 swords. Just a simple slash combo similar to other melee characters, I wouldn't do the 3rd sword so the tail can be more expressive and look cool when he jumps and stuff

Ability 1: BAMF

He teleports by aiming where he wants to go similar to a Loki clone but where he's switching to the spot instead of placing something

Ability 2: Mein Freund

Marks a teammate which he can then instantly teleport to by pressing the button again

Cooldown would start after he teleports to the teammate

Passive: Acrobatics

He gets a double jump similar to Spider-Man (no cooldown) and a similar wall climb as well, but I don't think a wall run

Ultimate: Hopesword

Pulls his Hopesword from his chest doing massive damage (125)

Halves the cooldown of bamf recharge allowing him to get more aggressive

Last for 8 seconds

Costumes I want:

Judgment Day design
Uncanny Spiderman design

Thank you for reading!`,

        'Projects/Hero%20Concepts/ProfXMR/ProfXMR.txt': `

Professor X Character Concept: Support/Strategist (1/?)

---

Primary Fire: Psychic Aid
He would have a similar auto aim lock on to scarlet witch or C&D but it would pulse either healing or damage to allies and enemies respectively. Not having insane damage though like Cloak, I'm thinking more like 50 damage per se and 100 HP per sec

Ability 1: Mental Wave
Heals allies and damage enemies in a CLOSE proximity (like 10 meters MAX imo) heals allies a TON like 200-300 and damage pretty good like maybe 100
Long cooldown

Ability 2: Chair Booster
Just a slight thruster in the direction Xavier is looking, similar to rockets but not as frequent. Just a slight movement tool

Ultimate(s?):
For his ultimates I originally had an idea but realized it was DPS focused but was still too cool not to share so I will. Maybe it could be a cool ability if nerfed or maybe he could choose between which ult like Symmetra could in OW idk

1st Ultimate: Dark Charles
It's from the X-Men cartoon originally but I think it was adapted into the comics. Xavier has a dark side of his mind where he unleashes powerful psychic attacks that feel real to the user leaving "him" invulnerable

Dark Xavier cont
In the game id imagine he'd project this from himself and then on a timer he'd be able to kill enemies while being invulnerable, but leaving his real body EXTREMELY vulnerable and when he dies it cancels the ult immediately

2nd Ultimate: Psychic Overload
Similar to Dr Stranger's Eye of Agamodo, but instead of it damage buffs all allies in radius and resets all ability cooldowns
This one is leaning way more support and feels more appropriate for a strategist.

Passive: Tech Chair
He gets slow fall with the chair

Thank you for reading!!!`,

        'Projects/Hero%20Concepts/AntManWaspMR/AntManWaspMR.txt': `

Ant-Man and the Wasp Character Concept: Art by ScottCohn on devianart

Support/Strategist

---

Notes: I've seen a lot of people want to make this character a swapping character similar to Cloak & Dagger and I think that's really cool, so that's how I'll do my character concept. First I'll do Ant-Man.

Ant Man:

Primary Fire: Punching Combo similar to Spider-Man but like without the kick at the end. I'm not a huge Ant-Man guy and all I remember is his blaster and the gun that can shrink and grow. I wanted to give those things to Wasp tho to make a cooler kit, I'll touch on that later.

Ability 1: Ant Elevator
I think it'd be really cool if he was able build with his ants in a way that could give more freedom to the team, similar to Life Weaver in overwatch. I think it should go fairly high also

Ability 2: Ant Trap
Setting an Ant Trap that when sprung has ants climb onto the victim dealing damage until the attack is over or their teammates shoot off the ants similar to Mantis Sleep.

Ability 3 (probably Alt Fire): Healing Ants
Hank has ants crawl and heal teammates from a distance. Have certain amount on a charge that heal overtime like Mantis

Shared Abilities:
Probably should have put this at the beginning but oh well. These are abilities both would have as the name implies ig

Small note:
I should add also, id imagine while you're controlling one, the other is shrunk down on the shoulder. I think it'd be a neat gimmick if the one on the shoulder was also a critical hitbox lol but idk. When shrunken both will be the same size

Shrink Ability:
I think both should either have their health cut massively when shrunken to balance out the fact that they should still attack at full damage because that is the gimmick of the characters. So I'd say if their max was 250 it should be maybe 100 when shrunken

Shrink Ability cont:
If you're currently Ant-Man while you're shrunken, I think you should ride an ant and get access to a wall climb via the ant, being able to jump off and attack unsuspecting targets or heal safely from below

Shrink Ability cont:
If you're the Wasp I think you should be able to fly around while carrying Ant-Man and he uses your Stinger gun to both heal and damage enemies

Swapping Ability:
Press it to swap characters, one grows and one shrinks onto that ones shoulder

The Wasp:

Primary Fire: Stingers
Using them she can heal and damage allies similar to Juno from overwatch but like dual wield and really cool and the Wasp wow

Ability 1: Float Like a Butterfly...
Give her a swift dash in any movement direction for some mobility

Passive:
Give her perma flight like Iron Man and Storm. Make it slow enough to where it's not annoying for either party to shoot her or for her to survive. I'm kinda hesitant because a whole team of flyers would be annoying for controller players but it almost feels inevitable

Ultimate: Ant Man and The Wasp
Ant-Man grows REALLY BIG and gets increased health and damage on melee while the wasp stays tinyish flying around Ant-Man and automatically heals and damage allies and enemies respectively in range for a limited time

If you read all that I'm legitimately surprised and thank you so much`,

        'Projects/Hero%20Concepts/DaredevilMR/DaredevilMR.txt': `

Daredevil Character Concept: DPS/Duelist

---

Primary Fire: Billy Clubs
He'd swing with his billy clubs in a fast & close hard hitting combo

Alt Fire: Swinging the Billy Club
He swings it out for a ranged attack. This would probably have like 2 or 3 charges with a cooldown

Ability 1: Grappling Hook
This could either be a swing similar to Spider-Man or a straight on grapple like Moon Knight but I think he needs one nonetheless

Ability 2: Confessional
I think this part of his kit would be the hardest to balance for obvious reasons. I think he should have an ability with 3 or so charges on an 8 second cooldown that pings people within a 20 meter radius for his ENTIRE TEAM, like punisher passive.

Ability 2 cont:
Reasoning behind this is like I think daredevil would communicate and say where people are at, but maybe that could be a team up instead and the ability could just be for himself but the player could ping them idk

Ultimate: Them Murdock Boys
On ult activation I think he should full heal plus 100 bonus health, and then while ult is active (like 15 seconds), have his damage increase scale to how low his health is. So the lower the health the higher the damage. Refresh bonus health on kill

Nerd Notes:
Daredevil is a fan favorite and probably the hardest to balance while being faithful to the character. I thought of his ult due to the quote from the show. I think the ult represents the "not backing down no matter how messed up I get" that daredevil does

As always thanks for reading`,

        'Projects/Hero%20Concepts/GhostRiderMR/GhostRiderMR.txt': `

Ghost Rider Character Concept: DPS/Duelist`,

        'Projects/Hero%20Concepts/GhostRiderVanguardMR/GhostRiderVanguardMR.txt': `

Ghost Rider Vanguard Concept: A Thread for @JETTyoutube

---

I've made a dps Ghost Rider concept in the past but he can honestly work as both as his hitbox can be increased without it being weird. You can easily give him more height and broader shoulders to fit a vanguard silhouette.

This concept envisions him as a 650hp mid to close range brawler using his chain whip to either keep the space or close it. Limited use of his motorcycle for movement, and control which ill explain below

Passive: Spirit of Vengeance
While in his own Hellfire, Ghost Rider heals at a rate of 25hp per sec

Melee: Chain Whip
3 chain whips each dealing 50 dmg that take 1.5 seconds to complete before a small pause. These whips extend 7 meters in a horizontal arc

Special 1: Chain Pull [15 sec CD]
Hog Hook from Overwatch lol, I just think it's such a fun move and this game is already so chaotic it would be so fun imo
Ghost Rider sends his chain out 10m and if it hit's an opponent that opponent is then pulled to GR. Stuns during pull

Special 2: Hell Cycle [20 sec CD]
Johnny spawns in his Hell Cycle and quickly rides it 10 meters taking 1 second, leaving a wall of Hellfire that obscures line of sight and slight damages enemies that pass through it for 10 damage. Last 5 seconds

Special 3: Hellfire [2 Charges, 10 second Cooldown]
Spawn an eruption of Hellfire from a point you select that does an initial burst of 30 dmg, and a lasting effect in the 3 meter radius of 10 dmg per second
Last for 3 seconds

Ultimate: Penance Stare [3000 Energy Cost]
The targeting acts like Hulk Ult Grab where its a solo target close ranged animation. Does more damage the higher killstreak an enemy has scaling from base damage of 50, then an addition 25 damage for each kill after that with no cap

Ult Continued:
So basically if the enemy Hela is stomping and on a 10 killstreak without dying, go ahead and chain hook her into ult to do 300 damage and insta kill her lol

Skins: All other Ghost Riders — Danny Ketch, Robbie Reyes, Alejandra Jones, and Charlie`,

        'Projects/Hero%20Concepts/JuggernautMR/JuggernautMR.txt': `

The Juggernaut Character Concept: Tank/Vanguard

A Thread`,

        'Projects/Hero%20Concepts/Ace/Ace.txt': `

Ace — Overwatch DPS/Damage Concept

Hero Lore:
A Carefree baseball omnic who before the awakening was a baseball training
assistant and afterwards continued his job as he found a true love for baseball.

Hero Kit:
Ace carries 2 different weapons — his Baseball and his Bat. "Two Way Player"
ability swaps between them (similar to Rammattra).

Weapon 1 [Fastball]:
- Primary: Throws a fastball pitch dealing 100 damage, bounces off enemies.
  Infinite ammo, 1 ball/sec. Falloff at 15m (reduced to 10 dmg).
- Secondary "Strike Out": Charged pitch (1.5s), 100-200 damage, cannot move
  while charging. Projectile speed increases from 100% to 130%.

Weapon 2 [At Bat]:
- Primary: Baseball bat swing for 50 dmg (100dps). Timed swings can hit own
  baseballs again for +100 dmg.
- Secondary "Dinger": Charged swing (1.5s) that knocks back enemies.
  Damage 50-150, knockback range 2m-8m.

Movement:
- "Pop Fly" (Fastball): Charged jump 5m-15m, catches projectiles during jump
  (D.Va matrix style). 15s cooldown, ground-only.
- "Slide" (At Bat): Slide 5m in look direction.

Passive "Bases Loaded":
After 3 eliminations with At Bat, next Secondary Fire on each weapon is
auto-charged. 10s cooldown between activations.

Ultimate "HOME RUN":
Tosses ball up and slams it forward. Ripple effect: 30 damage, pushback.
Direct hit: 300 damage. Critical hit: 500 damage.

Voicelines:
- Enemies: "BATTER UP"
- Self/Allies: "PLAY BALL"
- "HOOOOOT DOOGGG"`,

        'Projects/Hero%20Concepts/MilesMoralesMR/MilesMoralesMR.txt': `

Miles Morales Character Concept: Support/Strategist

A Thread

Preface:
A lot of people may be questioning the choice of support for Miles.
I have 2 main reasonings behind it. A webslinger in every role would
be amazing for diversity of the cast, and having cool and popular
characters in the support role helps people to want to play it`,

        'Projects/Hero%20Concepts/DocOckMR/DocOckMR.txt': `

Doctor Octopus Character Concept: Support/Strategist

Preface:
"I think he fits duelist or tank more", these are all valid but I feel as though there isn't a lot of popular healers/support characters in Marvel so changes will have to be made to some character which I like to do. I'm also imagining this pre Superior Spider-Man

Passive: Tentacles
When not using all 4 of his tentacles he is able to move quicker than normal walking speed. While using at least one of them he moves slower than normal walking speed on just 2 tentacles. He can wall climb at normal speed using the tentacles, and can use his tentacles to heal and damage while using his other 2 to hang onto the wall.

Primary Fire: Laser Tentacle (top right)
Slow firing but mid damaging beam. Overheat system like Orisa in OW2.

Alt Fire: Healing Tentacle (top left)
Auto-target beam towards allies healing them. Same overheat mechanic.

Both can be used at the same time, consuming both overheat bars faster.

Ability 1: Overdrive
10 seconds, decreases overheat buildup. 30 second cooldown.

Ability 2: Quick Escape
Ejects from tentacles leaving them as a turret auto-healing/damaging nearby. 200hp health bar on tentacles. Can be destroyed leaving Doc Oct with melee until they return in 15 seconds. Press again to recall.

Ultimate: All Hands on Deck
Uses all 4 tentacles to weave a beam of destruction and healing forward for 5 seconds (Moira-like). Afterwards vulnerable until tentacles recharge after 3 seconds.

Team Up: Shared Minds (Spider-Man)
Oct makes spider bots giving Peter a trap that auto-adds a web tracker`,

        'Projects/Video%20Games/AISCharon/AISCharon.txt': `
AIS Charon

A video game concept.
---
`,

        'Projects/Software/ClassRegistration/ClassRegistration.txt': `
University Class Registration Software

Built in a group of 6 as a course registration system.
Used Azure Cloud Development and SQL to allow users to register for courses.
Used AI Foundry to make an AI assistant that helped users build their perfect schedule.
`,

        'Projects/Software/MusicMaker/MusicMaker.txt': `
Custom Music Making Software

Built in a group of 4, designed a music making software where users could make short songs and play the notes using JavaFX.
`,

        'Projects/Software/DesignPatterns/DesignPatterns.txt': `
Basic Design Patterns

Coded the beginner design patterns:
- Decorator
- Iterator
- Observer
- Singleton
- State
- Strategy
`,

        'Projects/Software/TipTracker/TipTracker.txt': `
Tip Tracker

A tool for tracking and logging daily tips.
`,

        'Projects/Software/Portfolio/Portfolio.txt': `
Portfolio

This website!
A portfolio built with HTML, CSS, and JavaScript, with an Xbox dashboard inspired tile UI.
`,

        'Projects/Other/GoatOfGoats/GoatOfGoats.txt': `
Goat of Goats

The ultimate goat ranking.
`
    };

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderInline(text) {
        return escapeHtml(text)
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+([0-9]+(?:\.[0-9]+)?%|[0-9]+(?:\.[0-9]+)?x[0-9]+(?:\.[0-9]+)?))?\)/g, (m, alt, src, size) => {
                let attrs = `class="modal-img" src="${src}" alt="${alt}" loading="lazy"`;
                if (size) {
                    const p = size.split('x');
                    if (p.length === 2) attrs += ` width="${p[0]}" height="${p[1]}"`;
                    else if (size.endsWith('%')) attrs += ` style="width:${size}"`;
                }
                return `<img ${attrs}>`;
            })
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/(^|[^*])\*([^*\s*][^*]*?)\*(?![*])/g, '$1<em>$2</em>')
            .replace(/~~([^~]+)~~/g, '<del>$1</del>');
    }

    function renderModalText(text) {
        const lines = String(text).replace(/\r\n/g, '\n').split('\n');
        const out = [];
        let list = null;

        const closeList = () => {
            if (!list) return;
            out.push(`<${list.type}>`);
            list.items.forEach(item => out.push(`<li>${item}</li>`));
            out.push(`</${list.type}>`);
            list = null;
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            if (trimmed === '') { closeList(); continue; }

            const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
            if (heading) {
                closeList();
                out.push(`<h${heading[1].length}>${renderInline(heading[2])}</h${heading[1].length}>`);
                continue;
            }

            if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
                closeList();
                out.push('<hr>');
                continue;
            }

            if (trimmed.startsWith('>')) {
                closeList();
                const quote = [];
                while (i < lines.length && lines[i].trim().startsWith('>')) {
                    quote.push(lines[i].trim().replace(/^>\s?/, ''));
                    i++;
                }
                i--;
                out.push(`<blockquote>${quote.map(renderInline).join('<br>')}</blockquote>`);
                continue;
            }

            const ulItem = trimmed.match(/^[-*]\s+(.*)$/);
            const olItem = trimmed.match(/^\d+[.)]\s+(.*)$/);
            if (ulItem || olItem) {
                closeList();
                const type = ulItem ? 'ul' : 'ol';
                list = { type, items: [renderInline((ulItem || olItem)[1])] };
                while (i + 1 < lines.length) {
                    const n = lines[i + 1].trim();
                    const nU = n.match(/^[-*]\s+(.*)$/);
                    const nO = n.match(/^\d+[.)]\s+(.*)$/);
                    if ((type === 'ul' && nU) || (type === 'ol' && nO)) {
                        list.items.push(renderInline((nU || nO)[1]));
                        i++;
                    } else break;
                }
                continue;
            }

            closeList();
            const para = [];
            while (i < lines.length && lines[i].trim() !== '') {
                para.push(renderInline(lines[i]));
                i++;
            }
            i--;
            out.push(`<p>${para.join('<br>')}</p>`);
        }
        closeList();
        return out.join('');
    }

    function prefetchModalImages(root) {
        root.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            if (!src) return;
            const probe = new Image();
            probe.src = src;
        });
    }

    function openProjectModal(file) {
        if (!file) return;
        heroModalBody.innerHTML = renderModalText(heroContent[file] || 'Content not found.');
        prefetchModalImages(heroModalBody);
        heroModal.classList.add('active');
        fetch(file)
            .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
            .then(text => {
                heroModalBody.innerHTML = renderModalText(text);
                prefetchModalImages(heroModalBody);
            })
            .catch(() => {});
    }

    document.querySelectorAll('.tile-hero-modal').forEach(tile => {
        tile.addEventListener('click', () => {
            openProjectModal(tile.dataset.file);
        });
    });

    if (heroModalClose) {
        heroModalClose.addEventListener('click', () => {
            heroModal.classList.remove('active');
        });
    }

    if (heroModal) {
        heroModal.addEventListener('click', (e) => {
            if (e.target === heroModal) {
                heroModal.classList.remove('active');
            }
        });
    }

    // Dog modal
    const dogModal = document.getElementById('dogModal');
    const dogModalBody = document.getElementById('dogModalBody');
    const dogModalClose = document.getElementById('dogModalClose');
    const dogTile = document.querySelector('.tile-dog');

    const dogImages = [
        'images/projects/Dog/dog.png',
        'images/projects/Dog/dog_bread.png',
        'images/projects/Dog/dog_fry.png',
        'images/projects/Dog/dog_grass.png',
        'images/projects/Dog/dog_puppy.png',
        'images/projects/Dog/dog_silly.png',
        'images/projects/Dog/dog_smile.png',
        'images/projects/Dog/dog_stick.png'
    ];

    const dogViewModal = document.getElementById('dogViewModal');
    const dogViewBody = document.getElementById('dogViewBody');
    const dogViewBack = document.getElementById('dogViewBack');

    if (dogTile) {
        dogTile.addEventListener('click', () => {
            dogModalBody.innerHTML = dogImages.map(src =>
                `<div class="dog-modal-img"><img src="${src}" alt="dog photo"></div>`
            ).join('');
            dogModal.classList.add('active');
        });
    }

    dogModalBody.addEventListener('click', (e) => {
        const imgWrap = e.target.closest('.dog-modal-img');
        if (!imgWrap) return;
        const img = imgWrap.querySelector('img');
        if (!img) return;
        dogViewBody.innerHTML = '';
        const fullImg = document.createElement('img');
        fullImg.src = img.src;
        fullImg.alt = 'dog photo';
        dogViewBody.appendChild(fullImg);
        dogModal.classList.remove('active');
        dogViewModal.classList.add('active');
    });

    if (dogModalClose) {
        dogModalClose.addEventListener('click', () => {
            dogModal.classList.remove('active');
        });
    }

    if (dogModal) {
        dogModal.addEventListener('click', (e) => {
            if (e.target === dogModal) {
                dogModal.classList.remove('active');
            }
        });
    }

    if (dogViewBack) {
        dogViewBack.addEventListener('click', () => {
            dogViewModal.classList.remove('active');
            dogModal.classList.add('active');
        });
    }

    if (dogViewModal) {
        dogViewModal.addEventListener('click', (e) => {
            if (e.target === dogViewModal) {
                dogViewModal.classList.remove('active');
                dogModal.classList.add('active');
            }
        });
    }

    // Hero filter dropdown
    const heroTiles = document.querySelectorAll('#tab-heroconcepts .tile-hero-modal');    const filterBar = document.getElementById('heroFilterBar');

    if (heroTiles.length && filterBar) {
        const tagSet = new Set();
        heroTiles.forEach(t => (t.dataset.tags || '').split(',').forEach(tag => { if (tag) tagSet.add(tag); }));

        const toggle = document.createElement('button');
        toggle.className = 'hero-filter-toggle';
        toggle.textContent = 'Filter';
        filterBar.appendChild(toggle);

        const dropdown = document.createElement('div');
        dropdown.className = 'hero-filter-dropdown';
        filterBar.appendChild(dropdown);

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle.classList.toggle('open');
            dropdown.classList.toggle('open');
        });

        document.addEventListener('click', () => {
            toggle.classList.remove('open');
            dropdown.classList.remove('open');
        });

        const activeFilters = new Set();

        function applyFilter() {
            heroTiles.forEach(t => {
                const tags = (t.dataset.tags || '').split(',');
                const match = activeFilters.size === 0 || [...activeFilters].some(f => tags.includes(f));
                t.classList.toggle('hidden', !match);
            });
        }

        const tagOrder = ['overwatch', 'marvel-rivals'];
        [...tagSet].sort((a, b) => {
            const ai = tagOrder.indexOf(a);
            const bi = tagOrder.indexOf(b);
            if (ai !== -1 && bi !== -1) return ai - bi;
            if (ai !== -1) return -1;
            if (bi !== -1) return 1;
            return a.localeCompare(b);
        }).forEach(tag => {
            const label = document.createElement('label');
            label.className = 'hero-filter-option';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.value = tag;
            cb.addEventListener('change', () => {
                if (cb.checked) activeFilters.add(tag);
                else activeFilters.delete(tag);
                applyFilter();
            });
            label.appendChild(cb);
            label.appendChild(document.createTextNode(tag));
            dropdown.appendChild(label);
        });
    }

    // Contact form (Formspree)
    const contactForm = document.getElementById('contactForm');
    const contactFormStatus = document.getElementById('contactFormStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (contactFormStatus) {
                contactFormStatus.className = 'contact-form-status';
                contactFormStatus.textContent = 'Sending...';
            }
            const btn = contactForm.querySelector('.contact-form-btn');
            if (btn) btn.disabled = true;

            fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            }).then(res => {
                if (res.ok) {
                    if (contactFormStatus) {
                        contactFormStatus.className = 'contact-form-status success';
                        contactFormStatus.textContent = 'Thanks! Your message has been sent.';
                    }
                    contactForm.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            }).catch(() => {
                if (contactFormStatus) {
                    contactFormStatus.className = 'contact-form-status error';
                    contactFormStatus.textContent = 'Oops! Something went wrong. Please try again.';
                }
            }).finally(() => {
                if (btn) btn.disabled = false;
            });
        });
    }

    // Keyboard accessibility: make clickable tiles focusable and operable
    function makeKeyboardAccessible(selector) {
        document.querySelectorAll(selector).forEach(el => {
            if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT') return;
            el.setAttribute('tabindex', '0');
            el.setAttribute('role', 'button');
            if (!el.hasAttribute('aria-label')) {
                el.setAttribute('aria-label', el.textContent.trim() || el.dataset.tab || 'Interactive');
            }
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    el.click();
                }
            });
        });
    }
    makeKeyboardAccessible('.tile-nav, .tile-hero-modal, .tile-dog, #easyModeBtn');

    // Move focus for skip link and tab changes
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            content.focus({ preventScroll: true });
        });
    }
});
