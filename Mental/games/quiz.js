window.MC = window.MC || {};
window.MC.games = window.MC.games || {};

window.MC.games.quiz = function(container, config, onComplete) {
  const total = config.difficulty === 'facil' ? 8 : config.difficulty === 'medio' ? 12 : 16;
  const questions = MC.utils.shuffle([...MC.content.quiz]).slice(0, total);
  let qIdx = 0; let score = 0;

  function render() {
    if (qIdx >= questions.length) { onComplete({ score, maxScore: questions.length, timeMs: 0 }); return; }
    const q = questions[qIdx];
    container.innerHTML = `
      <div class="game-box">
        <div class="phase-label">🎵 Quiz Cultural — Pergunta ${qIdx+1} de ${questions.length}</div>
        <div class="progress-bar-wrap" style="margin-bottom:20px">
          <div class="progress-bar" style="width:${(qIdx/questions.length)*100}%"></div>
        </div>
        <div class="game-question">${q.p}</div>
        <div class="options-grid" id="opts"></div>
      </div>`;
    const grid = document.getElementById('opts');
    q.op.forEach((op, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = op;
      btn.addEventListener('click', () => {
        grid.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
        if (i === q.c) { btn.classList.add('correct'); score++; }
        else {
          btn.classList.add('wrong');
          grid.querySelectorAll('.option-btn')[q.c].classList.add('correct');
        }
        qIdx++;
        setTimeout(render, 1200);
      });
      grid.appendChild(btn);
    });
  }

  render();
};
