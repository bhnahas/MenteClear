window.MC = window.MC || {};
window.MC.games = window.MC.games || {};

window.MC.games.sequencia = function(container, config, onComplete) {
  const colors = [
    { id: 0, bg: '#EF4444', name: 'Vermelho' },
    { id: 1, bg: '#3B82F6', name: 'Azul' },
    { id: 2, bg: '#10B981', name: 'Verde' },
    { id: 3, bg: '#F59E0B', name: 'Amarelo' }
  ];
  const rounds = config.difficulty === 'facil' ? 4 : config.difficulty === 'medio' ? 6 : 8;
  const startLen = config.difficulty === 'facil' ? 3 : 4;
  let sequence = []; let userSeq = []; let currentRound = 0;
  let score = 0; let playing = false;

  function render() {
    container.innerHTML = `
      <div class="game-box" style="text-align:center">
        <div class="phase-label" id="seq-status">Preparando...</div>
        <div class="sequence-pads" style="margin:24px auto">
          ${colors.map(c => `<button class="seq-pad" id="pad-${c.id}" style="background:${c.bg}" data-id="${c.id}" aria-label="${c.name}"></button>`).join('')}
        </div>
        <div id="seq-round" style="font-size:17px;color:var(--text-muted);font-weight:600">Rodada ${currentRound+1} de ${rounds}</div>
      </div>`;
    container.querySelectorAll('.seq-pad').forEach(p => p.addEventListener('click', () => { if (!playing) handleClick(parseInt(p.dataset.id)); }));
    setTimeout(nextRound, 600);
  }

  function nextRound() {
    if (currentRound >= rounds) { onComplete({ score, maxScore: rounds, timeMs: 0 }); return; }
    userSeq = [];
    const len = startLen + currentRound;
    while (sequence.length < len) sequence.push(Math.floor(Math.random() * 4));
    document.getElementById('seq-status').textContent = '👀 Observe a sequência...';
    document.getElementById('seq-round').textContent = `Rodada ${currentRound+1} de ${rounds}`;
    playing = true; playSequence();
  }

  function playSequence() {
    let i = 0;
    function next() {
      if (i >= sequence.length) { playing = false; document.getElementById('seq-status').textContent = '🎯 Agora repita!'; return; }
      const padEl = document.getElementById(`pad-${sequence[i]}`);
      padEl.classList.add('lit');
      setTimeout(() => { padEl.classList.remove('lit'); i++; setTimeout(next, 300); }, 600);
    }
    setTimeout(next, 500);
  }

  function handleClick(id) {
    const padEl = document.getElementById(`pad-${id}`);
    padEl.classList.add('lit'); setTimeout(() => padEl.classList.remove('lit'), 300);
    userSeq.push(id);
    const idx = userSeq.length - 1;
    if (userSeq[idx] !== sequence[idx]) {
      document.getElementById('seq-status').textContent = '❌ Errou! Tente novamente nesta rodada.';
      setTimeout(() => { userSeq = []; playing = true; playSequence(); }, 1200);
      return;
    }
    if (userSeq.length === sequence.length) {
      score++; currentRound++;
      document.getElementById('seq-status').textContent = '✅ Correto!';
      setTimeout(nextRound, 900);
    }
  }

  render();
};
