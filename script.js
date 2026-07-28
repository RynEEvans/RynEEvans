document.addEventListener('DOMContentLoaded', () => {
    const scaleWrap = document.getElementById('scaleWrap');
    const content = document.getElementById('mainContent');

    function fitToScreen() {
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
    const tabOrder = ['home', 'about', 'projects', 'contact', 'resume', 'interests'];

    function switchTab(targetId) {
        const currentTab = document.querySelector('.mini-tab.active');
        const currentId = currentTab ? currentTab.dataset.tab : 'home';
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

        document.querySelector('.content').scrollTop = 0;
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });

    navTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            switchTab(tile.dataset.tab);
        });
    });

    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
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

    interestBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            const title = btn.querySelector('h3').textContent;
            if (interestImages[title] && interestImg) {
                interestImg.style.backgroundImage = `url('${interestImages[title]}')`;
            }
        });
    });

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
});
