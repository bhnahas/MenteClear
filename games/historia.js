window.MC = window.MC || {};
window.MC.games = window.MC.games || {};

window.MC.games.historia = function(container, config, onComplete) {
  const historias = MC.utils.shuffle([...MC.content.historias]);
  const numStories = config.difficulty === 'facil' ? 1 : config.difficulty === 'medio' ? 2 : 3;
  let storyIdx = 0; let qIdx = 0; let phase = 'read'; // 'read' | 'questions'
  let score = 0; let maxScore = 0;

  historias.slice(0, numStories).forEach(h => { maxScore += h.perguntas.length; });

  function render() {
    const h = historias[storyIdx];
    if (phase === 'read') renderRead(h);
    else renderQuestion(h, qIdx);
  }

  function renderRead(h) {
    container.innerHTML = `
      <div class="game-box">
        <h3 style="font-size:22px;font-weight:800;margin-bottom:16px;color:var(--primary)">📖 ${h.titulo}</h3>
        <div class="story-text">${h.texto}</div>
        <div style="text-align:center">
          <button class="btn btn-primary" id="ready-btn">Pronto para as perguntas →</button>
        </div>
      </div>`;
    document.getElementById('ready-btn').addEventListener('click', () => { phase = 'questions'; qIdx = 0; render(); });
  }

  function renderQuestion(h, qi) {
    const q = h.perguntas[qi];
    container.innerHTML = `
      <div class="game-box">
        <div class="phase-label">📝 História ${storyIdx+1} — Pergunta ${qi+1} de ${h.perguntas.length}</div>
        <div class="game-question">${q.texto}</div>
        <div class="options-grid" id="opts"></div>
      </div>`;
    const grid = document.getElementById('opts');
    q.opcoes.forEach((op, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = op;
      btn.addEventListener('click', () => {
        grid.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
        if (i === q.correta) { btn.classList.add('correct'); score++; } 
        else { btn.classList.add('wrong'); grid.querySelectorAll('.option-btn')[q.correta].classList.add('correct'); }
        setTimeout(advance, 1100);
      });
      grid.appendChild(btn);
    });
  }

  function advance() {
    const h = historias[storyIdx];
    qIdx++;
    if (qIdx >= h.perguntas.length) {
      storyIdx++;
      if (storyIdx >= numStories) { onComplete({ score, maxScore, timeMs: 0 }); return; }
      phase = 'read'; qIdx = 0;
    } else phase = 'questions';
    render();
  }

  render();
};
