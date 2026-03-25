window.MC = window.MC || {};
window.MC.games = window.MC.games || {};

window.MC.games.timeline = function(container, config, onComplete) {
  const count = config.difficulty === 'facil' ? 4 : config.difficulty === 'medio' ? 6 : 8;
  const events = MC.utils.shuffle([...MC.content.timeline]).slice(0, count);
  let items = MC.utils.shuffle([...events]);
  let dragSrc = null;
  let checked = false;

  function render() {
    container.innerHTML = `
      <div class="game-box">
        <div class="phase-label">📅 Arraste os eventos para a ordem cronológica correta (mais antigo em cima)</div>
        <div class="timeline-list" id="tl-list"></div>
        <div style="text-align:center;margin-top:24px">
          <button class="btn btn-primary" id="check-btn">✅ Verificar Ordem</button>
        </div>
        <div id="tl-result" style="margin-top:16px;text-align:center;font-size:20px;font-weight:700"></div>
      </div>`;
    renderList();
    document.getElementById('check-btn').addEventListener('click', checkOrder);
  }

  function renderList() {
    const list = document.getElementById('tl-list');
    list.innerHTML = '';
    items.forEach((ev, i) => {
      const div = document.createElement('div');
      div.className = 'tl-item';
      div.draggable = true;
      div.dataset.idx = i;
      div.innerHTML = `<span class="tl-handle">☰</span><span class="tl-texto">${ev.evento}</span>`;
      div.addEventListener('dragstart', e => { dragSrc = i; div.classList.add('dragging'); });
      div.addEventListener('dragend', () => div.classList.remove('dragging'));
      div.addEventListener('dragover', e => { e.preventDefault(); div.classList.add('drag-over'); });
      div.addEventListener('dragleave', () => div.classList.remove('drag-over'));
      div.addEventListener('drop', e => {
        e.preventDefault();
        div.classList.remove('drag-over');
        if (dragSrc !== null && dragSrc !== i) {
          const tmp = items[dragSrc];
          items[dragSrc] = items[i];
          items[i] = tmp;
          renderList();
        }
      });
      list.appendChild(div);
    });
  }

  function checkOrder() {
    if (checked) return;
    checked = true;
    const correct = [...events].sort((a, b) => a.ano - b.ano);
    let score = 0;
    const listItems = document.querySelectorAll('.tl-item');
    items.forEach((ev, i) => {
      if (ev.ano === correct[i].ano) {
        score++;
        const span = listItems[i].querySelector('.tl-texto');
        listItems[i].style.borderColor = 'var(--secondary)';
        listItems[i].style.background = 'var(--secondary-light)';
        span.innerHTML = `<strong>${ev.ano}</strong> – ${ev.evento}`;
      } else {
        listItems[i].style.borderColor = 'var(--danger)';
        listItems[i].style.background = 'var(--danger-light)';
        const span = listItems[i].querySelector('.tl-texto');
        span.innerHTML = `${ev.evento} <small style="color:var(--danger)">(era ${ev.ano}, posição correta: ${correct.findIndex(c=>c.ano===ev.ano)+1})</small>`;
      }
    });
    document.getElementById('tl-result').textContent = `Você acertou ${score} de ${count} posições!`;
    document.getElementById('check-btn').disabled = true;
    setTimeout(() => onComplete({ score, maxScore: count, timeMs: 0 }), 2500);
  }

  render();
};
