window.MC = window.MC || {};

// Main Application Controller
const App = {
  state: {
    user: JSON.parse(localStorage.getItem('mc_user')) || null,
    totalPoints: parseInt(localStorage.getItem('mc_points')) || 0,
    history: JSON.parse(localStorage.getItem('mc_history')) || [],
    activeGameId: null,
    gameStartTime: 0
  },

  gamesList: [
    { id: 'associacao', cat: 'Memória (Curta)', title: 'Associação de Imagens', icon: '🖼️', color: '#6366F1' },
    { id: 'sequencia', cat: 'Memória (Curta)', title: 'Gênios da Cor', icon: '🔴', color: '#EF4444' },
    { id: 'historia', cat: 'Memória (Média)', title: 'Leitura Assistida', icon: '📖', color: '#10B981' },
    { id: 'rostos', cat: 'Memória (Média)', title: 'Reconhecimento', icon: '👤', color: '#8B5CF6' },
    { id: 'timeline', cat: 'Memória (Longa)', title: 'Linha do Tempo', icon: '🕰️', color: '#F59E0B' },
    { id: 'quiz', cat: 'Memória (Longa)', title: 'Quiz Cultural', icon: '🎶', color: '#EC4899' },
    { id: 'logica', cat: 'Exercício', title: 'Sudoku Lógico', icon: '🧩', color: '#06B6D4' },
    { id: 'diferencas', cat: 'Exercício', title: 'Jogo dos Erros', icon: '🔎', color: '#F97316' },
    { id: 'linguagem', cat: 'Exercício', title: 'Complete a Frase', icon: '📝', color: '#14B8A6' }
  ],

  init() {
    this.root = document.getElementById('app');
    MC.utils = {
      shuffle: (arr) => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }
    };
    this.render();
  },

  render() {
    if (!this.state.user) {
      this.showWelcome();
    } else {
      this.showDashboard();
    }
  },

  showWelcome() {
    this.root.innerHTML = `
      <div class="screen">
        <div class="hero">
          <span class="hero-logo">🧠</span>
          <h1>MenteClear</h1>
          <p>Treinamento cognitivo divertido e acolhedor para a terceira idade. Exercite sua mente todos os dias!</p>
        </div>
        <div class="welcome-actions container">
          <div class="card profile-form">
            <h2 style="font-size:28px;margin-bottom:24px;color:var(--text)">Bem-vindo(a)! Como podemos te chamar?</h2>
            <div class="form-group">
              <input type="text" id="username" class="form-input" placeholder="Seu nome" autocomplete="off">
            </div>
            <div class="form-group">
              <label class="form-label">Escolha a dificuldade:</label>
              <div class="difficulty-options">
                <div class="diff-btn active" data-val="facil"><span class="diff-icon">🟢</span>Iniciante</div>
                <div class="diff-btn" data-val="medio"><span class="diff-icon">🟡</span>Intermediário</div>
                <div class="diff-btn" data-val="dificil"><span class="diff-icon">🔴</span>Avançado</div>
              </div>
            </div>
            <button class="btn btn-primary btn-lg" style="width:100%" id="start-btn">Começar a Jogar →</button>
            <div style="margin-top:24px"><a href="relatorios.html" style="color:var(--primary);font-weight:600;font-size:16px;text-decoration:none">Área do Profissional</a></div>
          </div>
        </div>
      </div>
    `;

    const diffs = this.root.querySelectorAll('.diff-btn');
    let selectedDiff = 'facil';
    diffs.forEach(btn => btn.addEventListener('click', () => {
      diffs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDiff = btn.dataset.val;
    }));

    this.root.querySelector('#start-btn').addEventListener('click', () => {
      const name = this.root.querySelector('#username').value.trim();
      if (!name) return this.showToast('Por favor, digite seu nome.', 'error');
      
      this.state.user = { name, difficulty: selectedDiff };
      localStorage.setItem('mc_user', JSON.stringify(this.state.user));
      this.render();
      this.showToast(`Olá, ${name}! Bem-vindo ao MenteClear.`, 'success');
    });
  },

  showDashboard() {
    const gamesHtml = this.gamesList.map(g => `
      <div class="game-card" data-id="${g.id}" style="--card-color:${g.color}">
        <span class="game-card-icon">${g.icon}</span>
        <div class="game-card-cat">${g.cat}</div>
        <div class="game-card-title">${g.title}</div>
        <div class="game-card-badge">Jogar →</div>
      </div>
    `).join('');

    this.root.innerHTML = `
      <div class="screen" style="background:var(--bg)">
        <nav class="navbar">
          <div class="navbar-brand">🧠 MenteClear</div>
          <div style="display:flex;gap:12px;align-items:center">
            <span style="font-weight:600;display:none;@media(min-width:600px){display:block}">Olá, ${this.state.user.name}</span>
            <div class="navbar-points">⭐ ${this.state.totalPoints}</div>
            <button class="btn btn-ghost" id="logout-btn" style="padding:8px" title="Sair">🚪</button>
          </div>
        </nav>
        
        <div class="hero" style="padding:40px 20px 30px;text-align:left">
          <div class="container" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px">
            <div>
              <h1 style="font-size:32px;margin:0 0 8px">O que vamos treinar hoje?</h1>
              <p style="margin:0;max-width:400px;font-size:18px">Escolha uma atividade abaixo para estimular sua memória e atenção.</p>
            </div>
            <a href="relatorios.html" class="btn btn-outline" style="background:transparent;color:white;border-color:rgba(255,255,255,0.4)">📊 Ver Relatórios</a>
          </div>
        </div>

        <div class="dashboard-grid pop-in">
          ${gamesHtml}
        </div>
      </div>
    `;

    this.root.querySelectorAll('.game-card').forEach(c => {
      c.addEventListener('click', () => this.startGame(c.dataset.id));
    });
    this.root.querySelector('#logout-btn').addEventListener('click', () => {
      localStorage.removeItem('mc_user'); this.state.user = null; this.render();
    });
  },

  startGame(id) {
    this.state.activeGameId = id;
    this.state.gameStartTime = Date.now();
    const gameInfo = this.gamesList.find(g => g.id === id);

    this.root.innerHTML = `
      <div class="screen" style="background:var(--bg)">
        <nav class="navbar" style="justify-content:flex-start;gap:20px">
          <button class="btn btn-ghost" id="back-btn" style="padding:8px;font-size:24px">←</button>
          <div class="game-title" style="margin:0">${gameInfo.icon} ${gameInfo.title}</div>
        </nav>
        <div class="container game-screen">
          <div id="game-container"></div>
        </div>
      </div>
    `;

    this.root.querySelector('#back-btn').addEventListener('click', () => this.showDashboard());
    const gc = this.root.querySelector('#game-container');
    
    // Launch game module
    if (MC.games[id]) {
      MC.games[id](gc, { difficulty: this.state.user.difficulty }, (res) => this.finishGame(res));
    } else {
      gc.innerHTML = '<div class="card" style="text-align:center;padding:40px;color:red;font-weight:700">Em desenvolvimento...</div>';
    }
  },

  finishGame(result) {
    const { score, maxScore } = result;
    const timePlayed = Date.now() - this.state.gameStartTime;
    
    // Calc points (base 10 per correct answer, bonus for perfection)
    let pointsEarned = (score * 10);
    if (score === maxScore && score > 0) pointsEarned += 20;

    // Save state
    this.state.totalPoints += pointsEarned;
    localStorage.setItem('mc_points', this.state.totalPoints);
    
    this.state.history.push({
      date: new Date().toISOString(),
      gameId: this.state.activeGameId,
      score, maxScore, pointsEarned, timePlayed
    });
    localStorage.setItem('mc_history', JSON.stringify(this.state.history));

    const pct = maxScore > 0 ? (score / maxScore) : 0;
    const stars = pct === 1 ? '⭐⭐⭐' : pct >= 0.5 ? '⭐⭐' : '⭐';

    this.root.innerHTML = `
      <div class="screen" style="background:var(--bg)">
        <nav class="navbar">
          <div class="navbar-brand" id="gohome" style="cursor:pointer">🧠 MenteClear</div>
          <div class="navbar-points">⭐ ${this.state.totalPoints}</div>
        </nav>
        
        <div class="result-hero celebrate">
          <div class="result-star">🏆</div>
          <div class="result-label">Atividade Concluída!</div>
          <div class="result-score">${score} / ${maxScore}</div>
          <div class="stars-row">${stars}</div>
          <div class="result-points">+${pointsEarned} pontos ganhos</div>
        </div>

        <div class="container" style="text-align:center;padding:60px 20px">
          <h2 style="font-size:28px;margin-bottom:30px">Muito bem, ${this.state.user.name}!</h2>
          <button class="btn btn-primary btn-lg" id="dash-btn" style="min-width:280px">Voltar ao Menu</button>
        </div>
      </div>
    `;

    this.root.querySelector('#dash-btn').addEventListener('click', () => this.showDashboard());
    this.root.querySelector('#gohome').addEventListener('click', () => this.showDashboard());
  },

  showToast(msg, type = 'success') {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }
};

window.onload = () => App.init();
