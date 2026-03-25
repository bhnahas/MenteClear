window.MC = window.MC || {};
window.MC.games = window.MC.games || {};

window.MC.games.linguagem = function(container, config, onComplete) {
  const total = config.difficulty === 'facil' ? 8 : config.difficulty === 'medio' ? 12 : 15;
  const questions = MC.utils.shuffle([...MC.content.linguagem]).slice(0, total);
  let qIdx = 0; let score = 0;

  function render() {
    if (qIdx >= questions.length) { onComplete({ score, maxScore: questions.length, timeMs: 0 }); return; }
    const q = questions[qIdx];
    const highlighted = q.frase.replace('___', '<span style="display:inline-block;min-width:100px;border-bottom:3px solid var(--primary);color:var(--primary-dark);font-weight:800;padding:0 8px">____</span>');
    container.innerHTML = `
      <div class="game-box">
        <div class="phase-label">✏️ Complete a frase — Pergunta ${qIdx+1} de ${questions.length}</div>
        <div class="progress-bar-wrap" style="margin-bottom:20px">
          <div class="progress-bar" style="width:${(qIdx/questions.length)*100}%"></div>
        </div>
        <div class="game-question" style="font-size:22px;margin-bottom:28px">${highlighted}</div>
        <div class="options-grid" id="opts"></div>
      </div>`;
    const grid = document.getElementById('opts');
    q.palavras.forEach((w, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = w;
      btn.addEventListener('click', () => {
        grid.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
        if (i === q.correta) { btn.classList.add('correct'); score++; }
        else { btn.classList.add('wrong'); grid.querySelectorAll('.option-btn')[q.correta].classList.add('correct'); }
        qIdx++;
        setTimeout(render, 1100);
      });
      grid.appendChild(btn);
    });
  }

  render();
};
