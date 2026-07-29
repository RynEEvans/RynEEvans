document.addEventListener('DOMContentLoaded', () => {
    const scaleWrap = document.getElementById('scaleWrap');
    const content = document.getElementById('mainContent');

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
    const tabOrder = ['home', 'about', 'projects', 'contact', 'resume', 'interests'];
    const navHistory = [];

    const tabLabels = {
        home: 'Home',
        about: 'About',
        projects: 'Projects',
        contact: 'Contact',
        resume: 'Resume',
        interests: 'Interests'
    };

    function switchTab(targetId, pushHistory = true) {
        const currentTab = document.querySelector('.mini-tab.active');
        const currentId = currentTab ? currentTab.dataset.tab : 'home';

        if (pushHistory && currentId !== targetId) {
            navHistory.push(currentId);
        }

        const prevIndex = tabOrder.indexOf(currentId);
        const nextIndex = tabOrder.indexOf(targetId);
        const direction = nextIndex >= prevIndex ? 'right' : 'left';

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
            switchTab(tab.dataset.tab);
        });
    });

    navTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            if (tile.classList.contains('tile-back')) {
                goBack();
            } else {
                switchTab(tile.dataset.tab);
            }
        });
    });

    backButtons.forEach(btn => {
        btn.addEventListener('click', goBack);
    });

    const interestReactiveBg = document.querySelector('.tile-interest-reactive-bg');
    const interestHoverTiles = document.querySelectorAll('.tile-interest-hover');
    const interestImages = {
        'Video Games': 'images/game1.png',
        'Music': 'images/band1.png',
        'Books & Comics': 'images/book1.png'
    };

    if (interestReactiveBg) {
        interestReactiveBg.style.backgroundImage = "url('images/game1.png')";
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
        musicToggle.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                musicToggle.classList.remove('playing');
            } else {
                bgMusic.play();
                musicToggle.classList.add('playing');
            }
            isPlaying = !isPlaying;
        });
    }

    document.addEventListener('keydown', (e) => {
        const currentTab = document.querySelector('.mini-tab.active');
        const currentIndex = tabOrder.indexOf(currentTab.dataset.tab);

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + tabOrder.length) % tabOrder.length;
            switchTab(tabOrder[prevIndex]);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % tabOrder.length;
            switchTab(tabOrder[nextIndex]);
        }
    });

    const easyModeBtn = document.getElementById('easyModeBtn');
    if (easyModeBtn) {
        easyModeBtn.addEventListener('click', () => {
            document.body.classList.toggle('easy-mode');
        });
    }
});
