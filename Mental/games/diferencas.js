window.MC = window.MC || {};
window.MC.games = window.MC.games || {};

window.MC.games.diferencas = function(container, config, onComplete) {
  const sets = MC.utils.shuffle([...MC.content.diferencas]);
  const set = sets[0];
  const toFind = set.difs.length;
  let found = new Set();

  function render() {
    container.innerHTML = `
      <div class="game-box">
        <div class="phase-label">🔍 Encontre as ${toFind} diferenças! Clique nas células diferentes na imagem da DIREITA.</div>
        <div id="dif-found" style="text-align:center;font-weight:700;font-size:19px;color:var(--primary);margin-bottom:14px">Encontradas: 0 / ${toFind}</div>
        <div class="dif-container" id="dif-cont"></div>
      </div>`;
    renderGrids();
  }

  function renderGrids() {
    const cont = document.getElementById('dif-cont');
    cont.innerHTML = `
      <div class="dif-grid-wrap">
        <div class="dif-label">Imagem 1 (original)</div>
        <div class="dif-grid" id="grid-left"></div>
      </div>
      <div class="dif-grid-wrap">
        <div class="dif-label">Imagem 2 (clique aqui!)</div>
        <div class="dif-grid" id="grid-right"></div>
      </div>`;

    const left = document.getElementById('grid-left');
    const right = document.getElementById('grid-right');

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const lc = document.createElement('div');
        lc.className = 'dif-cell';
        lc.textContent = set.esquerda[r][c];
        left.appendChild(lc);

        const rc = document.createElement('div');
        rc.className = 'dif-cell clickable';
        rc.textContent = set.direita[r][c];
        rc.dataset.r = r; rc.dataset.c = c;
        const isDif = set.difs.some(d => d[0] === r && d[1] === c);
        if (found.has(`${r},${c}`)) rc.classList.add('found');
        rc.addEventListener('click', () => {
          if (found.has(`${r},${c}`)) return;
          if (isDif) {
            found.add(`${r},${c}`);
            rc.classList.add('found');
            document.getElementById('dif-found').textContent = `Encontradas: ${found.size} / ${toFind}`;
            if (found.size === toFind) setTimeout(() => onComplete({ score: toFind, maxScore: toFind, timeMs: 0 }), 800);
          } else {
            rc.classList.add('wrong');
            setTimeout(() => rc.classList.remove('wrong'), 600);
          }
        });
        right.appendChild(rc);
      }
    }
  }

  render();
};
