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
  if (level >= 1 && level <= 4) return 4;      // 8 kort
  if (level >= 5 && level <= 8) return 5;      // 10 kort
  if (level >= 9 && level <= 12) return 6;     // 12 kort
  return 8;                                    // 16 kort
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
  card.addEventListener('click', onCardClicked);
  return card;
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

        target.classList.remove('done');
        target.classList.add('color-hidden');
        target.style.backgroundColor = '';

        clickedCard = null;
        preventClick = false;
      }, 800);
    } else {
      matchesFound++;
      updateScoreDisplay();
      clickedCard = null;

    if (matchesFound === totalPairs) {
  showLevelPopup(level); // 👈 Visa popup

  setTimeout(() => {
    level++;
    startLevel();
  }, 2000); // ⏳ Vänta 2 sekunder innan nästa nivå
}


function showLevelPopup(currentLevel) {
  const popup = document.getElementById('levelPopup');
  const popupText = document.getElementById('popupText');

  popupText.textContent = `Du har klarat nivå ${currentLevel}!`;
  popup.classList.remove('hidden');

  setTimeout(() => {
    popup.classList.add('hidden');
  }, 1500); // Visa popup i 1.5 sekunder
}

    }
  }
}

// === Initiera spelet ===
window.addEventListener('DOMContentLoaded', startLevel);
