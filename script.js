// === Globala variabler ===
let clickedCard = null;
let preventClick = false;
let matchesFound = 0;
let level = 1;
let totalPairs = 4;

const colors = [
  'red', 'green', 'yellow', 'blue',
  'pink', 'aqua', 'orange', 'brown',
  'purple', 'lime', 'teal', 'gold'
];

// === Nivålogik ===
function getPairsForLevel(level) {
  if (level >= 1 && level <= 8) return 4;
  if (level >= 9 && level <= 16) return 6;
  if (level >= 17 && level <= 24) return 8;
  return 4; // fallback om nivån är utanför intervallet
}

// === Uppdatera poängvisning ===
function updateScoreDisplay() {
  document.getElementById('score').textContent = `${matchesFound} av ${totalPairs}`;
}

// === Skapa en spelbricka ===
function createCard(color) {
  const card = document.createElement('div');
  card.className = 'card color-hidden';
  card.setAttribute('data-color', color);
  card.style.backgroundColor = '';
  card.textContent = '🎃'; // 👈 Frågetecken som standard
  card.addEventListener('click', onCardClicked);
  return card;
}

// === Fyrverkerier ===
function showFireworks(callback) {
  const duration = 2500;
  const end = Date.now() + duration;

  const interval = setInterval(() => {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#ffff00', '#00ff00', '#0000ff']
    });

    if (Date.now() > end) {
      clearInterval(interval);
      if (typeof callback === 'function') callback(); // 🔚 Kör nästa steg
    }
  }, 250);
}


// === Starta nivå ===
function startLevel() {
  totalPairs = getPairsForLevel(level);

  const gameBoard = document.getElementById('gameBoard');
  gameBoard.innerHTML = '';       // 🧹 Töm tidigare kort
  gameBoard.className = '';       // 🧼 Ta bort gamla layoutklasser

  matchesFound = 0;
  clickedCard = null;
  preventClick = false;

  updateScoreDisplay();
  document.getElementById('level').textContent = level;

  // 🎯 Lägg till layout- och storleksklass beroende på antal par
  if (totalPairs === 4) {
    gameBoard.classList.add('layout-4x2', 'card-size-large');
  } else if (totalPairs === 5) {
    gameBoard.classList.add('layout-5x2', 'card-size-medium');
  } else if (totalPairs === 6) {
    gameBoard.classList.add('layout-4x3', 'card-size-medium');
  } else {
    gameBoard.classList.add('layout-4x4', 'card-size-small');
  }

  console.log("Layoutklass:", gameBoard.className);


  // 🎨 Skapa färgpar och blanda
  const colorPairs = colors.slice(0, totalPairs);
  const allColors = [...colorPairs, ...colorPairs];
  allColors.sort(() => Math.random() - 0.5);

  // 🧩 Skapa kort
  allColors.forEach(color => {
    gameBoard.appendChild(createCard(color));
  });

  // 🔍 Visa färger att hitta
  const colorList = document.getElementById('colorList');
  colorList.innerHTML = '';
  colorPairs.forEach(color => {
    const preview = document.createElement('div');
    preview.className = 'colorPreview';
    preview.style.backgroundColor = color;
    preview.setAttribute('data-color', color);
    colorList.appendChild(preview);
  });
}

// === Hantera klick på kort ===
function onCardClicked(e) {
  const target = e.currentTarget;

  if (
    preventClick ||
    target === clickedCard ||
    target.classList.contains('done')
  ) {
    return;
  }

  const color = target.getAttribute('data-color');
  target.style.backgroundColor = color;
  target.classList.remove('color-hidden');
  target.classList.add('done');
  target.textContent = ''; // 🧼 Ta bort frågetecknet när kortet visa

  if (!clickedCard) {
    clickedCard = target;
  } else {
    if (clickedCard.getAttribute('data-color') !== color) {
      preventClick = true;

      // 💫 Wiggle-effekt vid fel match
      clickedCard.classList.add('wiggle');
      target.classList.add('wiggle');

      setTimeout(() => {
        clickedCard.classList.remove('wiggle');
        target.classList.remove('wiggle');

        clickedCard.classList.remove('done');
        clickedCard.classList.add('color-hidden');
        clickedCard.style.backgroundColor = '';
        clickedCard.textContent = '🎃'; // 🔁 Lägg tillbaka frågetecknet

        target.classList.remove('done');
        target.classList.add('color-hidden');
        target.style.backgroundColor = '';
        target.textContent = '🎃'; // 🔁 Lägg tillbaka frågetecknet

        clickedCard = null;
        preventClick = false;
      }, 800);
    } else {
      matchesFound++;
      updateScoreDisplay();
      clickedCard = null;

if (matchesFound === totalPairs) {
  showFireworks(() => {
    showLevelPopup(level);
    setTimeout(() => {
      level++;
      startLevel();
    }, 1500); // ⏳ Starta nästa nivå efter popup
  });
}


function showLevelPopup(currentLevel) {
  const popup = document.getElementById('levelPopup');
  const popupText = document.getElementById('popupText');

  popupText.textContent = `Du har klarat nivå ${currentLevel}!`;
  popup.classList.remove('hidden');

  setTimeout(() => {
    popup.classList.add('hidden');
  }, 2000); // Visa popup i 2 sekunder
}

    }
  }
}

// === Initiera spelet ===
window.addEventListener('DOMContentLoaded', startLevel);
