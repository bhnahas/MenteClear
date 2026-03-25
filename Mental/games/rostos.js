window.MC = window.MC || {};
window.MC.games = window.MC.games || {};

window.MC.games.rostos = function(container, config, onComplete) {
  const count = config.difficulty === 'facil' ? 4 : config.difficulty === 'medio' ? 6 : 8;
  const people = MC.utils.shuffle([...MC.content.rostos]).slice(0, count);
  let phase = 'memorize'; let timeLeft = config.difficulty === 'facil' ? 20 : 15;
  let qIdx = 0; let score = 0; let timer;

  function buildAvatar(p, size = 80) {
    return `<div class="face-avatar" style="background:${p.cor};width:${size}px;height:${size}px;font-size:${size*0.38}px">
      ${p.letra}<span class="face-icon">${p.icone}</span>
    </div>`;
  }

  function renderMemorize() {
    container.innerHTML = `
      <div class="game-box">
        <div class="phase-label">👀 Memorize os rostos e nomes!</div>
        <div class="countdown" style="font-size:48px" id="cd">${timeLeft}</div>
        <div class="faces-grid" style="margin-top:16px" id="faces-grid"></div>
      </div>`;
    const grid = document.getElementById('faces-grid');
    people.forEach(p => {
      grid.innerHTML += `<div class="face-card">${buildAvatar(p)}<div class="face-name">${p.nome}</div></div>`;
    });
    timer = setInterval(() => {
      timeLeft--;
      const cd = document.getElementById('cd');
      if (cd) cd.textContent = timeLeft;
      if (timeLeft <= 0) { clearInterval(timer); phase = 'test'; render(); }
    }, 1000);
  }

  function renderTest() {
    if (qIdx >= people.length) { onComplete({ score, maxScore: people.length, timeMs: 0 }); return; }
    const correct = people[qIdx];
    const others = MC.utils.shuffle(MC.content.rostos.filter(r => r.nome !== correct.nome)).slice(0, 3);
    const options = MC.utils.shuffle([correct, ...others]);
    container.innerHTML = `
      <div class="game-box" style="text-align:center">
        <div class="phase-label">🤔 Quem é esta pessoa? (${qIdx+1}/${people.length})</div>
        <div style="display:flex;justify-content:center;margin:20px 0">${buildAvatar(correct, 110)}</div>
        <div class="options-grid" id="opts"></div>
      </div>`;
    const grid = document.getElementById('opts');
    options.forEach(op => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = op.nome;
      btn.addEventListener('click', () => {
        grid.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
        if (op.nome === correct.nome) { btn.classList.add('correct'); score++; }
        else { btn.classList.add('wrong'); grid.querySelectorAll('.option-btn').forEach(b => { if (b.textContent === correct.nome) b.classList.add('correct'); }); }
        qIdx++;
        setTimeout(renderTest, 1100);
      });
      grid.appendChild(btn);
    });
  }

  function render() { phase === 'memorize' ? renderMemorize() : renderTest(); }
  render();
};
