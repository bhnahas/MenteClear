window.MC = window.MC || {};
window.MC.games = window.MC.games || {};

window.MC.games.associacao = function(container, config, onComplete) {
  const pairs = MC.content.associacao;
  const count = config.difficulty === 'facil' ? 6 : config.difficulty === 'medio' ? 8 : 10;
  const selected = MC.utils.shuffle([...pairs]).slice(0, count);
  
  let phase = 'memorize'; // 'memorize' | 'match'
  let timeLeft = config.difficulty === 'facil' ? 12 : 8;
  let score = 0; let firstCard = null; let timer;
  let matchedCount = 0;
  
  function render() {
    if (phase === 'memorize') renderMemorize();
    else renderMatch();
  }

  function renderMemorize() {
    container.innerHTML = `
      <div class="game-box">
        <div class="phase-label">🧠 Memorize os pares!</div>
        <div class="countdown" id="cd">${timeLeft}</div>
        <div class="assoc-pairs" id="pairs-grid" style="margin-top:20px"></div>
      </div>`;
    const grid = document.getElementById('pairs-grid');
    selected.forEach(p => {
      grid.innerHTML += `<div class="emoji-card" style="font-size:44px;">${p.emoji}<div class="card-label">${p.palavra}</div></div>`;
    });
    timer = setInterval(() => {
      timeLeft--;
      const cd = document.getElementById('cd');
      if (cd) cd.textContent = timeLeft;
      if (timeLeft <= 0) { clearInterval(timer); phase = 'match'; firstCard = null; render(); }
    }, 1000);
  }

  function renderMatch() {
    const allWords = MC.utils.shuffle(selected.map(p => p.palavra));
    const allEmojis = MC.utils.shuffle([...selected]);
    container.innerHTML = `
      <div class="game-box">
        <div class="phase-label">🎯 Clique no emoji e depois na palavra correspondente! (${score}/${count})</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:600px;margin:0 auto">
          <div id="emoji-col"></div>
          <div id="word-col"></div>
        </div>
      </div>`;
    const ec = document.getElementById('emoji-col');
    const wc = document.getElementById('word-col');
    allEmojis.forEach((p,i) => {
      ec.innerHTML += `<div class="emoji-card" id="em-${i}" data-word="${p.palavra}" data-em="em-${i}" style="font-size:40px;margin-bottom:10px;min-height:80px;">${p.emoji}</div>`;
    });
    allWords.forEach((w,i) => {
      wc.innerHTML += `<div class="emoji-card" id="wd-${i}" data-word="${w}" data-wd="wd-${i}" style="font-size:18px;font-weight:700;margin-bottom:10px;min-height:80px;">${w}</div>`;
    });
    container.querySelectorAll('[data-em]').forEach(el => el.addEventListener('click', () => selectCard('emoji', el)));
    container.querySelectorAll('[data-wd]').forEach(el => el.addEventListener('click', () => selectCard('word', el)));
  }

  function selectCard(type, el) {
    if (el.classList.contains('matched')) return;
    if (!firstCard) {
      el.classList.add('selected');
      firstCard = { type, el, word: el.dataset.word };
    } else {
      if (firstCard.el === el) { el.classList.remove('selected'); firstCard = null; return; }
      if (firstCard.word === el.dataset.word) {
        firstCard.el.classList.remove('selected'); firstCard.el.classList.add('matched');
        el.classList.add('matched');
        score++; matchedCount++;
        firstCard = null;
        if (matchedCount === count) setTimeout(() => onComplete({ score: count, maxScore: count, timeMs: 0 }), 600);
      } else {
        firstCard.el.classList.remove('selected'); firstCard.el.classList.add('wrong-match');
        el.classList.add('wrong-match');
        setTimeout(() => { 
          firstCard && firstCard.el.classList.remove('wrong-match'); 
          el.classList.remove('wrong-match');
          firstCard = null; 
        }, 700);
        firstCard = null;
      }
    }
  }

  render();
};
