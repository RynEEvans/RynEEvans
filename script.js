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
    const tabOrder = ['home', 'about', 'projects', 'vgd', 'heroconcepts', 'contact', 'resume', 'interests'];
    const navHistory = [];

    const tabLabels = {
        home: 'Home',
        about: 'About',
        projects: 'Projects',
        contact: 'Contact',
        resume: 'Resume',
        interests: 'Interests',
        vgd: 'Video Game Design',
        heroconcepts: 'Hero Concepts'
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

    function positionArrows() {
        if (window.innerWidth < 700) {
            if (navArrowLeft) navArrowLeft.style.top = '';
            if (navArrowRight) navArrowRight.style.top = '';
            return;
        }
        const activeTab = document.querySelector('.tab-content.active');
        const activeId = activeTab ? activeTab.id.replace('tab-', '') : '';
        if (activeId === 'resume' || activeId === 'interests' || activeId === 'vgd' || activeId === 'heroconcepts') {
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
        const mainTabs = ['home', 'about', 'projects', 'contact'];
        const currentTab = document.querySelector('.mini-tab.active');
        const currentId = currentTab ? currentTab.dataset.tab : 'home';
        const currentIndex = mainTabs.indexOf(currentId);
        if (currentIndex === -1) {
            switchTab(direction === 1 ? 'home' : 'contact', true);
            return;
        }
        const nextIndex = (currentIndex + direction + mainTabs.length) % mainTabs.length;
        switchTab(mainTabs[nextIndex]);
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
        'Hero%20Concepts/NightcrawlerMR.txt': `Creepy Crawler @ThCreepyCrawler

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

        'Hero%20Concepts/ProfXMR.txt': `Creepy Crawler @ThCreepyCrawler

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

        'Hero%20Concepts/AntManWaspMR.txt': `Creepy Crawler @ThCreepyCrawler

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

        'Hero%20Concepts/DaredevilMR.txt': `Creepy Crawler @ThCreepyCrawler

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

        'Hero%20Concepts/GhostRiderMR.txt': `Creepy Crawler @ThCreepyCrawler

Ghost Rider Character Concept: DPS/Duelist`,

        'Hero%20Concepts/GhostRiderVanguardMR.txt': `Creepy Crawler @ThCreepyCrawler

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

        'Hero%20Concepts/JuggernautMR.txt': `Creepy Crawler @ThCreepyCrawler

The Juggernaut Character Concept: Tank/Vanguard

A Thread`,

        'Hero%20Concepts/MilesMoralesMR.txt': `Creepy Crawler @ThCreepyCrawler

Miles Morales Character Concept: Support/Strategist

A Thread

Preface:
A lot of people may be questioning the choice of support for Miles.
I have 2 main reasonings behind it. A webslinger in every role would
be amazing for diversity of the cast, and having cool and popular
characters in the support role helps people to want to play it`
    };

    document.querySelectorAll('.tile-hero-modal').forEach(tile => {
        tile.addEventListener('click', () => {
            const file = tile.dataset.file;
            if (!file) return;
            heroModalBody.textContent = heroContent[file] || 'Content not found.';
            heroModal.classList.add('active');
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
});
