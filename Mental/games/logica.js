window.MC = window.MC || {};
window.MC.games = window.MC.games || {};

window.MC.games.logica = function(container, config, onComplete) {
  const puzzles = MC.utils.shuffle([...MC.content.sudoku]);
  const puzzle = puzzles[0];
  const grade = puzzle.grade.map(r => [...r]);
  const solucao = puzzle.solucao.map(r => [...r]);
  let selected = null;

  function render() {
    container.innerHTML = `
      <div class="game-box">
        <div class="phase-label">🧩 Preencha o Sudoku 4×4 sem repetir números de 1 a 4 em cada linha, coluna e quadrante</div>
        <div class="sudoku-grid" id="sudoku" style="margin:24px auto"></div>
        <div class="sudoku-numpad" style="margin:20px 0" id="numpad">
          ${[1,2,3,4].map(n => `<button class="num-btn" data-n="${n}">${n}</button>`).join('')}
          <button class="num-btn" data-n="0" style="font-size:20px;color:var(--text-muted)">⌫</button>
        </div>
        <div style="text-align:center;margin-top:12px">
          <button class="btn btn-primary" id="check-btn">✅ Verificar</button>
          <button class="btn btn-ghost" id="reset-btn" style="margin-left:12px">↺ Reiniciar</button>
        </div>
        <div id="sudoku-msg" style="text-align:center;margin-top:16px;font-size:20px;font-weight:700"></div>
      </div>`;
    renderGrid();
    document.getElementById('numpad').querySelectorAll('.num-btn').forEach(b => {
      b.addEventListener('click', () => inputNum(parseInt(b.dataset.n)));
    });
    document.getElementById('check-btn').addEventListener('click', checkSolution);
    document.getElementById('reset-btn').addEventListener('click', () => {
      puzzle.grade.forEach((r, i) => r.forEach((v, j) => { grade[i][j] = v; }));
      selected = null; renderGrid();
    });
  }

  function renderGrid() {
    const grid = document.getElementById('sudoku');
    if (!grid) return;
    grid.innerHTML = '';
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const cell = document.createElement('div');
        cell.className = 'sudoku-cell';
        cell.dataset.r = r; cell.dataset.c = c;
        const val = grade[r][c];
        cell.textContent = val || '';
        if (puzzle.grade[r][c] !== 0) cell.classList.add('fixed');
        else {
          cell.addEventListener('click', () => {
            document.querySelectorAll('.sudoku-cell').forEach(el => el.classList.remove('selected'));
            cell.classList.add('selected');
            selected = { r, c };
          });
        }
        if (selected && selected.r === r && selected.c === c) cell.classList.add('selected');
        grid.appendChild(cell);
      }
    }
  }

  function inputNum(n) {
    if (!selected) return;
    const { r, c } = selected;
    if (puzzle.grade[r][c] !== 0) return;
    grade[r][c] = n === 0 ? 0 : n;
    renderGrid();
  }

  function checkSolution() {
    let correct = 0; let total = 0;
    const cells = document.querySelectorAll('.sudoku-cell');
    cells.forEach(cell => {
      const r = parseInt(cell.dataset.r), c = parseInt(cell.dataset.c);
      if (puzzle.grade[r][c] === 0) {
        total++;
        if (grade[r][c] === solucao[r][c]) { correct++; cell.classList.add('correct'); }
        else if (grade[r][c] !== 0) { cell.classList.add('error'); }
      }
    });
    const msg = document.getElementById('sudoku-msg');
    if (correct === total) {
      msg.textContent = '🎉 Parabéns! Sudoku completo!';
      setTimeout(() => onComplete({ score: total, maxScore: total, timeMs: 0 }), 1500);
    } else {
      msg.textContent = `${correct} de ${total} células corretas. Continue tentando!`;
    }
  }

  render();
};
